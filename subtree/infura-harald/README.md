# github.com/INFURA/project-harald-rudell

## Harald Rudell harugolden@icloud.com (415) 769-6398

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

## Project Development Flow
* Began using **swagger-go** client and models
* Discovered the swagger definition file **infura.yaml** fails validation
* Added polymorphism and discriminators to make **infura.yaml** validate
* Discovered v1 Infura API outdated, should use **v3**
* Developed a v3 definition file, discovered **arrays of differing element type** not possible in Swagger 2.0
* Rewrote using **http.Post**
* Added **REST** server
* **Dockerized**

## Load Test

go get -u github.com/tsenart/vegeta<br />
echo 'GET http://localhost:8000' | /Users/foxyboy/go/bin/vegeta attack -duration 10s

* macOS limits to 256 open files (ulimit -a)
* No errors during API execution
* Peaks at 124 requests during 1 s
<pre>
2018/11/18 20:01:53 Listening at ':8000': ^C to exit…
2018/11/18 20:01:54 First tick - 1 s
2018/11/18 20:02:00 Requests per second: 7
2018/11/18 20:02:01 Requests per second: 13
2018/11/18 20:02:02 Requests per second: 9
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 5ms
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 10ms
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 20ms
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 40ms
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 80ms
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 160ms
2018/11/18 20:02:03 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 320ms
2018/11/18 20:02:04 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 640ms
2018/11/18 20:02:04 Requests per second: 18
2018/11/18 20:02:04 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 1s
2018/11/18 20:02:05 Requests per second: 27
2018/11/18 20:02:05 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 1s
2018/11/18 20:02:06 Requests per second: 32
2018/11/18 20:02:06 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 1s
2018/11/18 20:02:07 Requests per second: 49
2018/11/18 20:02:07 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 1s
2018/11/18 20:02:08 Requests per second: 116
2018/11/18 20:02:08 http: Accept error: accept tcp [::]:8000: accept: too many open files; retrying in 1s
2018/11/18 20:02:09 Requests per second: 124
</pre>
## Harald Rudell harugolden@icloud.com (415) 769-6398
