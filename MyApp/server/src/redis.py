from redis import Redis

redis = Redis(host="myapp_redis", port="6379", db=0,
              socket_timeout=4, socket_connect_timeout=4, socket_keepalive=10)


""" 기본 명령어
set key value
get key
keys pattern        // list, hash, string, 등 의 모든 키 값 반환
setnx ket value     // key가 없을 경우에만 
getset key value    // get실행 후 set
getrange key index1 index2
setrange key index value
mset key value1 value2 ...
mget key1 key2
delete key
incr key [value]
decr key [value]

lpush key value1 value2   // 왼쪽 삽입
rpush key value1 value2   // 오른쪽 삽입
linsert key before|after target_value value
lset key index value      // 인덱스위치에 삽입
lindex key index          // 인덱스위치의 값 반환
lrange key index1 index2
ltrim key index1 index2   // index1~index2만 남음, 나머지 삭제

hmset
hset
hget
hmget
hkeys
hvals
hlen
hgetall
hsetnx

// 집합
sadd key val1 val2 ...
scard key     // 개수반환
smembers key  // 모든 값 반환
srem key value  // 삭제
sinter key1 key2    //  두 집합의 교집합
sinterstore key1 key2 new_key   // new_key에 결과를 저장
sunion key1 key2
sunionstore k1 k2 n_k
sdiff k1 k2
sdiffstore k1 k2 n_k

등 
 """
