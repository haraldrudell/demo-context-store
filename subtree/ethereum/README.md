# github.com/haraldrudell/ethereum

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

## Features
* Fetching **block number** and **block Unix time stamp** from **Ethereum mainnet** via **Infura API v3**
* **Command-line** and **REST** server invocation
* Implementing protocol: **JSON-RPC** v2
* Clever **declarative JSON parsing**
* Code architected by concern: **endpoint** and **per api** processig using shared functions
* REST server **logs requests per second** once per second


## Command-Line Interface
**go run cmd/infmain/infmain.go**

<pre>
infmain 0.0.1 Retrieve data from Ethereum via Infura
Last block number: 6,732,013 time stamp: 2018-11-18 22:28:59 -0800 PST
</pre>

## Docker

* docker build --tag infura/haraldrudell:latest .
* docker run --interactive --tty --publish 8000:8000 --name this --rm infura/haraldrudell:latest
* browse to **http://127.0.0.1:8000**

**docker run --interactive --tty --publish 8000:8000 --name this --rm infura/haraldrull:latest**
<pre>
2018/11/19 06:25:29 Listening at ':8000': ^C to exit…
2018/11/19 06:25:30 First tick - 1 s
2018/11/19 06:26:05 Requests per second: 1
</pre>

## Requirements
* Go 1.11 modules

## Load Test

go get -u github.com/tsenart/vegeta<br />
echo 'GET http://localhost:8000' | /Users/foxyboy/go/bin/vegeta attack -duration 10s

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
