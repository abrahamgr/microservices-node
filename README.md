# microservices-node

Practice for microservices

# Projects
## [conference-app](./conference-app/)

App that renders pages

## [service-registry](./service-registry/)

Service registry to handle services

## [feedback-service](./feedback-service/)

Handle services for speakers

## [speakers-service](./speakers-service/)

Handle services for feedback

# Prerequisites

Install [RabbitMQ](https://www.rabbitmq.com/download.html) to make feedback work

``` Shell
brew install rabbitmq
```

Run manually RabbitMQ service by running `/usr/local/opt/rabbitmq/sbin/rabbitmq-server` in the console.

# How to start
Start first the [conference-app](./conference-app/) project and then the other ones