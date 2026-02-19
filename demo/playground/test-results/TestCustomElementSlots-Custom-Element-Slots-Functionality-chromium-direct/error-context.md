# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Custom Element Slots Test" [level=1] [ref=e3]
  - generic [ref=e4]:
    - heading "Element with Children" [level=3] [ref=e5]
    - generic [ref=e6]:
      - paragraph [ref=e7]: This content goes into the slot
      - button "Slot Button" [ref=e8]
    - paragraph [ref=e9]: End of slot element
  - generic [ref=e10]:
    - heading "Element without Children" [level=3] [ref=e11]
    - paragraph [ref=e13]: End of slot element
  - generic [ref=e14]:
    - heading "TSX Slot Test" [level=3] [ref=e15]
    - generic [ref=e17]:
      - paragraph [ref=e18]: TSX-provided slot content
      - list [ref=e19]:
        - listitem [ref=e20]: Item 1
        - listitem [ref=e21]: Item 2
    - paragraph [ref=e22]: End of slot element
  - generic [ref=e23]:
    - heading "Outer Element" [level=3] [ref=e24]
    - generic [ref=e26]:
      - heading "Nested Slot Element" [level=3] [ref=e27]
      - paragraph [ref=e29]: Nested slot content
      - paragraph [ref=e30]: End of slot element
    - paragraph [ref=e31]: End of slot element
```