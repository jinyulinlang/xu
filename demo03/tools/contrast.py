# WCAG contrast calculator
import math

def srgb_to_linear(c):
    c = c/255.0
    if c <= 0.03928:
        return c/12.92
    return ((c+0.055)/1.055)**2.4

def luminance(hexcolor):
    hexcolor = hexcolor.lstrip('#')
    r = int(hexcolor[0:2],16)
    g = int(hexcolor[2:4],16)
    b = int(hexcolor[4:6],16)
    R = srgb_to_linear(r)
    G = srgb_to_linear(g)
    B = srgb_to_linear(b)
    return 0.2126*R + 0.7152*G + 0.0722*B

def contrast(c1, c2):
    L1 = luminance(c1)
    L2 = luminance(c2)
    lighter = max(L1,L2)
    darker = min(L1,L2)
    return (lighter+0.05)/(darker+0.05)

pairs = [
    # complete button: text vs background colors (test lighter and darker stops)
    ('#065f46', '#e6f7ef'),
    ('#065f46', '#d1f0e4'),
    # delete button
    ('#7f1d1d', '#fff1f2'),
    ('#7f1d1d', '#ffe3e6'),
]

print('Current contrast ratios:')
for fg,bg in pairs:
    c = contrast(fg,bg)
    print(f'  FG {fg} on BG {bg} => {c:.2f}:1')

# also test candidate replacements
candidates = [('#043527','#e6f7ef'),('#043527','#d1f0e4'),('#4a0b0b','#fff1f2'),('#4a0b0b','#ffe3e6')]
print('\nCandidate contrast ratios:')
for fg,bg in candidates:
    c = contrast(fg,bg)
    print(f'  FG {fg} on BG {bg} => {c:.2f}:1')
