# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Custom Element Basic Test" [level=1] [ref=e3]
  - generic [ref=e4]:
    - heading "Test Element" [level=2] [ref=e5]
    - paragraph [ref=e6]: "Count: 42"
    - paragraph [ref=e7]: "Active: Yes"
    - paragraph [ref=e9]: This is child content from TSX
  - generic [ref=e10]:
    - heading "HTML Attribute Title" [level=2] [ref=e11]
    - paragraph [ref=e12]: "Count: 100"
    - paragraph [ref=e13]: "Active: Yes"
    - paragraph [ref=e15]: This is child content from HTML - goes into slot
  - generic [ref=e16]:
    - heading "Mixed TSX" [level=2] [ref=e17]
    - paragraph [ref=e18]: "Count: undefined"
    - paragraph [ref=e19]: "Active: No"
    - generic [ref=e21]:
      - heading "Nested Custom Element" [level=2] [ref=e22]
      - paragraph [ref=e23]: "Count: 50"
      - paragraph [ref=e24]: "Active: No"
      - paragraph [ref=e26]: Nested content - goes into nested slot
```