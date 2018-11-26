# © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
# All rights reserved.

FROM golang:alpine as builder
ENV GO111MODULE=on
RUN apk update && apk add git && apk add ca-certificates
RUN adduser -D -g '' appuser
COPY . $GOPATH/src/github.com/INFURA/project-harald-rudell
WORKDIR $GOPATH/src/github.com/INFURA/project-harald-rudell
RUN go get -d -v
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -ldflags="-w -s" -o /go/bin/haraldrudell ./cmd/infrest

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /go/bin/haraldrudell /go/bin/haraldrudell
USER appuser
ENTRYPOINT ["/go/bin/haraldrudell"]
