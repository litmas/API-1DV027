flowchart LR
  %% =========================
  %% System Architecture
  %% =========================

  subgraph DG["Data Generator (data-generator/)"]
    dg["Sensor Simulator\nProduces hourly meter readings:\n- consumption_kwh\n- production_kwh\n- spot_price\nPublishes to Kafka"]
  end

  subgraph KAF["Kafka (infrastructure-k8s/)"]
    kafka["Kafka Topics\n(hourly meter readings)"]
  end

  subgraph AP["Algorithm Processor (algorithm-processor/prediction-api/)"]
    ap["Forecasting + decision logic\nConsumes Kafka\nWrites decisions to TimescaleDB\nOptionally enriches/caches history in Redis\nExposes HTTP:\n- /predict\n- /predict/spot-price"]
  end

  subgraph RED["Redis (cache)"]
    redis["Redis Cache\n(history/enrichment cache)"]
  end

  subgraph TS["TimescaleDB (authoritative time-series)\n(infrastructure-k8s/k8s/infra/timescaledb/)"]
    tsdb["TimescaleDB\nRaw meter readings + decisions"]
  end

  subgraph REST["REST API (rest-api/)"]
    rest["Public HTTP layer\n- Reads latest/history/decisions from TimescaleDB\n- Proxies prediction calls to Algorithm Processor\n- Enforces API key security\n- Serves Swagger + Custom UI"]
  end

  subgraph UI["Clients"]
    client["External Clients / UI"]
  end

  subgraph K8S["Infrastructure / K8s (infrastructure-k8s/ and k8s/ on server)"]
    k8s["Kubernetes Manifests\n- services: rest-api, algorithm-processor, timescaledb, kafka, redis\n- configmaps, secrets\n- ingress routing"]
  end

  %% =========================
  %% Data flows + dependencies
  %% =========================
  dg -->|"publish hourly readings"| kafka
  kafka -->|"consume readings"| ap

  ap -->|"write decisions (and optionally processed data)"| tsdb
  rest -->|"read latest/history/decisions"| tsdb

  rest -->|"proxy HTTP /predict, /predict/spot-price"| ap

  ap <-->|"cache/enrich history"| redis

  client -->|"HTTPS requests"| rest
