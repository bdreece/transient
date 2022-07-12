FROM golang:1.18-alpine

WORKDIR /usr/src/transient

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -v -o /usr/bin/transient

ENV PATH="$PATH:/usr/bin"

CMD [ "transient", "-vd", "/var/data/transient/bolt.db" ]

