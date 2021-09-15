from redis import Redis

redis = Redis(host="myapp_redis", port="6379", db=0,
              socket_timeout=4, socket_connect_timeout=4, socket_keepalive=10)