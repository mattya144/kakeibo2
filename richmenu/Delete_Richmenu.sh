. ./env.txt

curl -v -X DELETE https://api.line.me/v2/bot/user/all/richmenu/ \
    -H "Authorization: Bearer $(eval echo "${LINE_CHANNEL_ACCESS_TOKEN}")"