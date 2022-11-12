# Horras: Haikou Online Ride-hailing and Records Analysis System

## API Design

### Heatmap

GET /heatmap

#### request
```json
{
    // empty
}
```

#### Response

an array with shape of 150x24 

```json
[ // The first dim indicate the date id
    [200, 0, 123 ..., 123], // the second dim indicate the clock id at that date
    [200, 0, 123 ..., 123], 
    [200, 0, 123 ..., 123], 
]
```

### Geometry

GET /geometry

#### Request
```json
{
   	"date_range": 1, // 0 ~ 200
    "clock_range": 1, // 0 ~ 23
}
```

#### Response

```json
[
    {
        "id": 123, // int, Unique id of node
        "lat": 23.1, // float
        "lng": 27.3, // float
        "start_num": 234, // int
        "dest_num": 567, // int
    },
]
```

### Topology

GET /tpology

#### Request

```json
{ 
    "nodes": [1, 7, 23], // an array of int, unique id of nodes
    "date_range": 1,
    "clock_range": 1
}
```

```json
{
    "nodes": [1, 7, 23, 47, 58, 79],
    "edges": [
        {
            "x": 2,
            "y": 7,
            "xy_num": 32, // order num of x to y
            "yx_num": 47, //
        }
    ]
}
```