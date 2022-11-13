# Horras: Haikou Online Ride-hailing and Records Analysis System

Horras is a system for analyzing the data of online ride-hailing services in Haikou, China. It is designed to be used in classroom settings, mainly for teaching data analysis and visualization. The backend of Horras can be seen in [Horras-Backend](https://github.com/yanglinshu/horras-backend).

## API Design

### Heatmap

GET /heatmap

#### request

```javascript
{
  // empty
}
```

#### Response

an array with shape of 150x24

```javascript
[ // The first dim indicate the date id
    [200, 0, 123, ..., 123], // the second dim indicate the clock id at that date
    [200, 0, 123, ..., 123],
    [200, 0, 123, ..., 123],
    ...
]
```

### Geometry

GET /geometry

Get the map view data.

#### Request

```javascript
{
  "date_range": [1, 133], // 0 ~ 200
  "clock_range": [0, 21] // 0 ~ 23
}
```

#### Response

An array of nodes.

```javascript
[
  {
    "id": 123, // int, unique id of node
    "start_num": 234, // int
    "dest_num": 567 // int
  },
  ...
]
```

### Topology

GET /topology

#### Request

```javascript
{
  "nodes": [1, 7, 23], // an array of int, unique id of nodes
  "date_range": [1, 3],
  "clock_range": [3, 12]
}
```

#### Response

```javascript
{
  "nodes": [1, 7, 23, 47, 58, 79],
  "edges": [
    {
      "x": 2,
      "y": 7,
      "xy_num": 32, // order num of x to y
      "yx_num": 47 //
    },
    ...
  ]
}
```
