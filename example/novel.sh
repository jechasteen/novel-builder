# Output directory for built files
build=example/build

# Used in the filenames for ALL output types, e.g. book-novel.pdf, book-manuscript.pdf, book.epub
# **No Spaces**
filename=book

title="Example Book" # Required
subtitle="Not a Real Book" # Optional, delete if you don't have a subtitle
author="Jane Doe" # Required

#           WIDTH HEIGHT
trim_size=( 5.5in 8.5in )

#         TOP   OUTER BOTTOM INNER
margins=( 0.5in 0.5in 0.5in 0.75in )

parent_font="Libertinus Serif"
font_size="10pt"
sans_font="Libertinus Sans"
deco_font="NovelDeco.otf"
mono_font="Libertinus Mono"
math_font="Libertinus Math"

# See https://ctan.math.illinois.edu/macros/luatex/latex/novel/doc/novel-documentation.html#h4.3.3 and following for the next few
header_footer_style=1
head_jump=1.5
foot_jump=1.5
loose_head=50

# Placed just inside the page numbers, e.g.  -1- |    and    | -2-
#       Verso Recto
emblems=( "|" "|" )
# Place these on either side of the page number, e.g. -1-
page_number_deco=( "-" "-" )
verso_head_text=\\theAuthor
recto_head_text=\\theTitle

chapter_start_style=footer
chapter_start_height=10
scene_break_indent=false
recto=true

language=( english american )
