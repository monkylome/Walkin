Real duplications (worth extracting)                                                          
                                       
  1. categoryIcon map — duplicated in 5 files                                                   
  Identical { Tools: Hammer, Electronics: Zap, Hardware: Wrench, Apparel: Shirt, Other: Package 
  } in home, profile, search, item, store detail. Move to app/lib/categories.ts.                
                                                                                                
  2. categoryAccent map — duplicated in 4 files                                                 
  Same pill background/text classes for each category. Move alongside (1).
                                                                                                
  3. Distance + walk-time chip pair — duplicated in 2 files
  Identical two-card row (location-pin + clock SVGs, same layout) lives in both bottom-sheet.tsx
   and store/[slug]/page.tsx. Worth a <DistanceChips distance walkTime /> component.            
   
  4. Store logo / initials chip — three different implementations                               
  - /item has a StoreLogo component (w-10 h-10)
  - /stores does it inline (w-11 h-11)                                                          
  - Home uses a generic building SVG instead of initials
  Recommend: promote StoreLogo to app/components/store-logo.tsx with a size?: "sm" | "md" prop, 
  use it in /stores list and on home (replacing the building SVG → store identity becomes       
  consistent everywhere).                                                                       
                                                                                                
  Possibly worth doing, possibly not                                                            
                                                                                                
  5. Inline SVG sprawl
  Search icon, X, chevron, map-pin, clock, store-building — same shapes inlined many places. A  
  single app/components/icons.tsx exporting named <SearchIcon size={15} /> etc. would shrink JSX
   a lot, but it's a cosmetic refactor — no behavior change. Worth it if you find yourself
  touching these often.                                                                         
                  
  6. useMemo sweep
  The new AGENTS.md rule says "don't reach for useMemo." There are existing ones in /stores,
  /item, etc. that pre-date the rule. Tiny derivations are cheap to recompute on render — would 
  make the code more idiomatic for the new convention. Low risk, low value individually.
                                                                                                
  My ranked recommendation

  Do 1–4 (real duplications, real wins). Skip 5 unless you keep finding yourself editing the    
  same SVGs. Defer 6 to a sweep when convenient.
                                                                                                
  Want me to apply 1–4?

✻ Cogitated for 1m 6s             
                                                                                                
❯ do all 6          