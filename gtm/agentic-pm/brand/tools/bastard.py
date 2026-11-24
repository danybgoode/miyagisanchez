"""Bastardica-style font mixer for Despacho Bonsai (adapted from videovision/design/proposal/tools/bastard.py).

Every Nth letter swaps to a glyph from a "mix-in" font via a calt/liga contextual substitution,
so the output is a normal OpenType WOFF2 that works anywhere ligatures are on.
Concept: a human typeface with every Nth letter written by the machine (AI + human).

Usage: python bastard.py <out_dir>        (needs: pip install fonttools brotli)
All sources are SIL OFL (Google Fonts); outputs are renamed derivatives, as the OFL requires.
"""
import sys, os, io, urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools import subset

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "fontsrc")
GF = "https://raw.githubusercontent.com/google/fonts/main/"
SOURCES = {
    "Anton-Regular.ttf": "ofl/anton/Anton-Regular.ttf",
    "Archivo[wdth,wght].ttf": "ofl/archivo/Archivo%5Bwdth,wght%5D.ttf",
    "BigShouldersDisplay[wght].ttf": "ofl/bigshouldersdisplay/BigShouldersDisplay%5Bwght%5D.ttf",
    "Silkscreen-Bold.ttf": "ofl/silkscreen/Silkscreen-Bold.ttf",
    "Doto[ROND,wght].ttf": "ofl/doto/Doto%5BROND,wght%5D.ttf",
    "Michroma-Regular.ttf": "ofl/michroma/Michroma-Regular.ttf",
}
CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚÑÜáéíóúñü0123456789"
KEEP = CHARS + " .,;:!?¡¿'\"“”‘’()[]-–—_/\\&@#$%*+=<>|~^°·…→←↑↓×✓0123456789"


def ensure_sources():
    os.makedirs(SRC, exist_ok=True)
    for name, path in SOURCES.items():
        dest = os.path.join(SRC, name)
        if not os.path.exists(dest):
            urllib.request.urlretrieve(GF + path, dest)


def load(name, axes=None):
    f = TTFont(os.path.join(SRC, name))
    if "fvar" in f:
        loc = {a.axisTag: a.defaultValue for a in f["fvar"].axes}
        loc.update(axes or {})
        f = instancer.instantiateVariableFont(f, loc)
    return f


def cap(f):
    c = getattr(f["OS/2"], "sCapHeight", 0)
    if not c:
        gs = f.getGlyphSet(); bp = BoundsPen(gs); gs[f.getBestCmap()[ord("H")]].draw(bp); c = bp.bounds[3]
    return c


def bastard(out, base_name, mix_name, family, stride, scale_adj=1.0, yoff=0.0, base_axes=None, mix_axes=None, tracking=0):
    base, mix = load(base_name, base_axes), load(mix_name, mix_axes)
    s = cap(base) / cap(mix) * scale_adj
    bcmap, mcmap = base.getBestCmap(), mix.getBestCmap()
    mgs = mix.getGlyphSet()
    glyf, hmtx = base["glyf"], base["hmtx"]
    order = base.getGlyphOrder()
    pairs = []
    for ch in CHARS:
        u = ord(ch)
        if u not in bcmap or u not in mcmap:
            continue
        src, new = mcmap[u], f"{bcmap[u]}.bst"
        rec = DecomposingRecordingPen(mgs); mgs[src].draw(rec)
        # Tight fit: measure the scaled mix-in outline, then place it with the BASE glyph's
        # side bearings, so monospaced mix-ins (Doto) don't open gaps ("FOUND I NG").
        bp = BoundsPen(None); rec.replay(TransformPen(bp, (s, 0, 0, s, 0, 0)))
        b_adv, b_lsb = hmtx[bcmap[u]]
        bb = BoundsPen(base.getGlyphSet()); base.getGlyphSet()[bcmap[u]].draw(bb)
        b_rsb = b_adv - bb.bounds[2] if bb.bounds else 0
        xmin, xmax = (bp.bounds[0], bp.bounds[2]) if bp.bounds else (0, 0)
        dx = b_lsb - xmin + tracking / 2
        pen = TTGlyphPen(None)
        rec.replay(TransformPen(pen, (s, 0, 0, s, dx, yoff * cap(base))))
        g = pen.glyph(); glyf[new] = g
        if new not in order:
            order.append(new)
        g.recalcBounds(glyf)
        adv = round((xmax - xmin) + b_lsb + b_rsb + tracking) if bp.bounds else round(mix["hmtx"][src][0] * s)
        hmtx[new] = (adv, getattr(g, "xMin", 0) or 0)
        pairs.append((bcmap[u], new))
    base.setGlyphOrder(list(glyf.glyphOrder))
    base["maxp"].numGlyphs = len(base.getGlyphOrder())
    if "post" in base and base["post"].formatType == 2.0:
        base["post"].extraNames = []; base["post"].mapping = {}
    A = " ".join(p[0] for p in pairs); B = " ".join(p[1] for p in pairs)
    ctx = " ".join(["@L"] * (stride - 1))
    fea = (f"languagesystem DFLT dflt;\nlanguagesystem latn dflt;\n@L = [{A}];\n@B = [{B}];\n"
           f"lookup bast {{ sub {ctx} @L' by @B; }} bast;\nfeature calt {{ lookup bast; }} calt;\nfeature liga {{ lookup bast; }} liga;\n")
    if "GSUB" in base:
        del base["GSUB"]
    addOpenTypeFeaturesFromString(base, fea, tables=["GSUB"])
    name = base["name"]
    for rec in list(name.names):
        if rec.nameID in (1, 3, 4, 6, 16, 17, 21, 22, 25):
            name.removeNames(nameID=rec.nameID)
    ps = family.replace(" ", "")
    for nid, val in ((1, family), (2, "Regular"), (3, f"{ps}-Regular;despachobonsai"), (4, family), (6, f"{ps}-Regular")):
        name.setName(val, nid, 3, 1, 0x409)
    opts = subset.Options(); opts.layout_features = ["*"]; opts.flavor = "woff2"; opts.name_IDs = ["*"]; opts.notdef_outline = True
    sub = subset.Subsetter(opts); sub.populate(text=KEEP); sub.subset(base)
    buf = io.BytesIO(); base.flavor = "woff2"; base.save(buf)
    open(os.path.join(out, ps + ".woff2"), "wb").write(buf.getvalue())
    print(f"{family}: {len(pairs)} glyphs mixed, every {stride}th, scale {s:.3f}, {len(buf.getvalue())} bytes")


if __name__ == "__main__":
    OUT = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    ensure_sources()
    # DB Matriz = primary display (caps, >=40px). DB Orbita = alternate. (DB Compilado, Anton+Silkscreen, was rejected: illegible.)
    bastard(OUT, "Archivo[wdth,wght].ttf", "Doto[ROND,wght].ttf", "DB Matriz", 4, scale_adj=1.0,
            base_axes={"wdth": 62, "wght": 900}, mix_axes={"wght": 900, "ROND": 0})
    bastard(OUT, "BigShouldersDisplay[wght].ttf", "Michroma-Regular.ttf", "DB Orbita", 5, scale_adj=0.86,
            base_axes={"wght": 900})
