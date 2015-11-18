---
layout: post
title:  "Om static site generators"
date:   2015-11-12 19:27:42
categories: uppgiften
comments: true
---

Static site generators påminner till viss del om CSS preprocessors. Det finns flera html-filer som körs genom en static site generator och resultatet blir i en fil, en statisk sida, som länkar till de olika filerna. I mitt fall sker mycket av detta i filen default.html som länkar till flera andra filer.

Precis som när det gäller scss:en har jag behållit mycket av upplägget från den ursprungliga mallen. Det har, tror jag, bara tillkommit en enda ny fil under projekttiden: comments.html, som används till Disqus-kommentarer och länkas in i post.html.

Static site generators passar bra till enklare hemsidor. Det är ett väldigt rationellt system som innebär att väldigt lite, eller ingen, html-kod behöver upprepas samtidigt som webbplatsen blir snabb och smidig för användaren. Och även, tack vare enkelheten, mer säker.

Andra fördelar som vi har dragit nytta av är kompatibiliteten med markdown och GitHub.
