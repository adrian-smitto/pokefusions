# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - heading "PokeFusions" [level=1] [ref=e5]
      - paragraph [ref=e6]: AI-powered Pokemon fusion generator
      - paragraph [ref=e7]: Generate unique Pokemon fusions with creative names and descriptions
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: "Number of fusions:"
        - combobox "Number of fusions:" [disabled] [ref=e12]:
          - option "1"
          - option "2" [selected]
          - option "3"
          - option "4"
          - option "5"
          - option "6"
          - option "7"
          - option "8"
          - option "9"
          - option "10"
      - button "Generating..." [disabled] [ref=e13]:
        - generic [ref=e14]: Generating...
    - heading "Generating Fusions..." [level=2] [ref=e17]
    - contentinfo [ref=e70]:
      - paragraph [ref=e71]: Powered by Hugging Face AI • Pokemon data from PokeAPI
  - button "Open Next.js Dev Tools" [ref=e77] [cursor=pointer]:
    - img [ref=e78]
  - alert [ref=e81]
```