```mermaid
classDiagram
      WaterFall <|-- Draw
      Draw <|-- Utils
      class WaterFall{
      	initData
      	
      	+init()
      	+resize()
      	+update()
      }
```

