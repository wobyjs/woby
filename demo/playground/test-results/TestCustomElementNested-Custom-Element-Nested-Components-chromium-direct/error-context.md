# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Custom Element Nested Components Test" [level=1] [ref=e3]
  - generic [ref=e4]:
    - 'heading "Level 1: Main Root" [level=3] [ref=e5]'
    - paragraph [ref=e6]: "Count: 42"
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Main Intermediate" [level=4] [ref=e9]
        - paragraph [ref=e10]: "Count: 42"
        - paragraph [ref=e11]: "Active: Yes"
        - generic [ref=e12]:
          - generic [ref=e13]: "Leaf: Nested Leaf (100)"
          - generic [ref=e14]: "Leaf: Another Leaf (200)"
      - generic [ref=e15]: "Leaf: Direct Root Child (300)"
```