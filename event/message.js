const axios = require('axios');
const dbAPI = 'https://sheetdb.io/api/v1/7pcv6mz0r6dxw';
// テキストメッセージの処理をする関数
const textEvent = async (event, client) => {
  // ユーザーIDを取得
  const { userId } = event.source;
  // DBからユーザーのデータを取得
  const data = (await axios.get(`${dbAPI}/search?userId=${userId}`)).data[0];
  // もしそのユーザーのデータが存在する場合
  if (data) {
    // もしcontextがmemoModeだったら
    if (data.context === 'addMode') {
      // DBへメッセージのデータを追加してcontextを空にする
      const Addinfo = event.message.text.split("　");
      const Addinfo_price = Addinfo[1].replace("円","");
      const Date_info = new Date();
      const year = Date_info.getFullYear();
      /*const month = Date_info.getMonth()+1;
      const day = Date_info.getDay();
      const Addinfo_date = `${year}/${month}/${day}`;*/
      await axios.put(`${dbAPI}/userId/${userId}`, { data: [{ context: '' }] });
      await axios.post(dbAPI, { data:[{日付: year, 商品名: Addinfo[0], 値段: Addinfo_price}] });
      // index関数に返信するメッセージを返す
      return {
        type: 'text',
        text: `${event.message.text}というメッセージをdbに追加しました`,
      };
    }else if (data.context === 'moneyMode') {
      const Addinfo_money = event.message.text.replace("円","");
      await axios.put(`${dbAPI}/userId/${userId}`, { data: [{ context: '' }] });
      await axios.post(dbAPI, { data:[{金額設定: data.Addinfo_money}]});
      return {
        type: 'text',
        text: `${event.message.text}が今月の生活費だよ`
      };
    }
  }
  let message;
  // メッセージのテキストごとに条件分岐
  switch (event.message.text) {
    // 'こんにちは'というメッセージが送られてきた時
    case 'こんにちは': {
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: 'Hello, world',
      };
      break;
    }
    // 'メモ'というメッセージが送られてきた時
    case 'リスト': {
      // ユーザーのデータがDBに存在する時
      if (data) {
        // 返信するメッセージを作成
        message = {
          type: 'text',
          text: `メモには以下のメッセージが保存されています\n\n${data.message}`,
        };
      } else {
        // 返信するメッセージを作成
        message = {
          type: 'text',
          text: 'メモが存在しません',
        };
      }
      break;
    }
    // 'メモ開始'というメッセージが送られてきた時
    case '追加': {
      if (data) {
        await axios.put(`${dbAPI}/userId/${userId}`, { data: [{ context: 'addMode' }] });
      } else {
        await axios.post(dbAPI, { data: [{ userId, context: 'addMode' }] });
      }
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: '商品名と値段を空白切りにして入力してね',
      };
      break;
    }

    case '金額設定':{
      if(data) {
        await axios.put(`${dbAPI}/userId/${userId}`, { data: [{ context: 'moneyMode' }] });
      } else {
        await axios.post(dbAPI, { data: [{ userId, context: 'moneyMode' }] });
      }
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: '今月使えるお金はいくらまでかな？',
      };
      break;
    }

    // 'クイックリプライ'というメッセージが送られてきた時
    case 'クイックリプライ': {
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: 'クイックリプライ（以下のアクションはクイックリプライ専用で、他のメッセージタイプでは使用できません）',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'camera',
                label: 'カメラを開く',
              },
            },
            {
              type: 'action',
              action: {
                type: 'cameraRoll',
                label: 'カメラロールを開く',
              },
            },
            {
              type: 'action',
              action: {
                type: 'location',
                label: '位置情報画面を開く',
              },
            },
          ],
        },
      };
      break;
    }
    // 'スタンプメッセージ'というメッセージが送られてきた時
    case 'スタンプメッセージ': {
      // 返信するメッセージを作成
      message = {
        type: 'sticker',
        packageId: '446',
        stickerId: '1988',
      };
      break;
    }
    // '画像メッセージ'というメッセージが送られてきた時
    case '画像メッセージ': {
      // 返信するメッセージを作成
      message = {
        type: 'image',
        originalContentUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
        previewImageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
      };
      break;
    }
    // '音声メッセージ'というメッセージが送られてきた時
    case '音声メッセージ': {
      // 返信するメッセージを作成
      message = {
        type: 'audio',
        originalContentUrl:
          'https://github.com/shinbunbun/aizuhack-bot/blob/master/media/demo.m4a?raw=true',
        duration: 6000,
      };
      break;
    }
    // '動画メッセージ'というメッセージが送られてきた時
    case '動画メッセージ': {
      // 返信するメッセージを作成
      message = {
        type: 'video',
        originalContentUrl: 'https://github.com/shinbunbun/aizuhack-bot/blob/master/media/demo.mp4?raw=true',
        previewImageUrl: 'https://raw.githubusercontent.com/shinbunbun/aizuhack-bot/master/media/thumbnail.jpg?raw=true',
      };
      break;
    }
    // '位置情報メッセージ'というメッセージが送られてきた時
    case '位置情報メッセージ': {
      // 返信するメッセージを作成
      message = {
        type: 'location',
        title: 'my location',
        address: '〒160-0004 東京都新宿区四谷一丁目6番1号',
        latitude: 35.687574,
        longitude: 139.72922,
      };
      break;
    }
    // 'イメージマップメッセージ'というメッセージが送られてきた時
    case 'イメージマップメッセージ': {
      // イメージマップの画像の作成方法には細かい指定があります。参考→https://developers.line.biz/ja/reference/messaging-api/#imagemap-message
      message = [
        {
          type: 'imagemap',
          baseUrl:
            'https://youkan-storage.s3.ap-northeast-1.amazonaws.com/ubic_bunbun',
          altText: 'This is an imagemap',
          baseSize: {
            width: 1040,
            height: 597,
          },
          actions: [
            {
              type: 'uri',
              area: {
                x: 26,
                y: 113,
                width: 525,
                height: 170,
              },
              linkUri: 'https://www.u-aizu.ac.jp/intro/faculty/ubic/',
            },
            {
              type: 'uri',
              area: {
                x: 33,
                y: 331,
                width: 780,
                height: 177,
              },
              linkUri: 'https://shinbunbun.info/about/',
            },
            {
              type: 'uri',
              area: {
                x: 939,
                y: 484,
                width: 94,
                height: 105,
              },
              linkUri: 'https://www.u-aizu.ac.jp/',
            },
          ],
        },
        {
          type: 'text',
          text: '「UBIC」や「しんぶんぶん」のところをTAPしてみよう！',
        },
      ];
      break;
    }
    // 'ボタンテンプレート'というメッセージが送られてきた時
    case 'ボタンテンプレート': {
      // 返信するメッセージを作成
      message = {
        type: 'template',
        altText: 'ボタンテンプレート',
        template: {
          type: 'buttons',
          thumbnailImageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
          imageBackgroundColor: '#FFFFFF',
          title: 'ボタンテンプレート',
          text: 'ボタンだお',
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: 'https://shinbunbun.info/images/photos/',
          },
          actions: [
            {
              type: 'postback',
              label: 'ポストバックアクション',
              data: 'button-postback',
            },
            {
              type: 'message',
              label: 'メッセージアクション',
              text: 'button-message',
            },
            {
              type: 'uri',
              label: 'URIアクション',
              uri: 'https://shinbunbun.info/',
            },
            {
              type: 'datetimepicker',
              label: '日時選択アクション',
              data: 'button-date',
              mode: 'datetime',
              initial: '2021-06-01t00:00',
              max: '2022-12-31t23:59',
              min: '2021-06-01t00:00',
            },
          ],
        },
      };
      break;
    }
    // '確認テンプレート'というメッセージが送られてきた時
    case '確認テンプレート': {
      // 返信するメッセージを作成
      message = {
        type: 'template',
        altText: '確認テンプレート',
        template: {
          type: 'confirm',
          text: '確認テンプレート',
          actions: [
            {
              type: 'message',
              label: 'はい',
              text: 'yes',
            },
            {
              type: 'message',
              label: 'いいえ',
              text: 'no',
            },
          ],
        },
      };
      break;
    }
    // 'カルーセルテンプレート'というメッセージが送られてきた時
    case 'カルーセルテンプレート': {
      // 返信するメッセージを作成
      message = {
        type: 'template',
        altText: 'カルーセルテンプレート',
        template: {
          type: 'carousel',
          columns: [
            {
              thumbnailImageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
              imageBackgroundColor: '#FFFFFF',
              title: 'タイトル1',
              text: '説明1',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'https://shinbunbun.info/',
              },
              actions: [
                {
                  type: 'postback',
                  label: 'ポストバック',
                  data: 'postback-carousel-1',
                },
                {
                  type: 'uri',
                  label: 'URIアクション',
                  uri: 'https://shinbunbun.info/',
                },
              ],
            },
            {
              thumbnailImageUrl:
                'https://shinbunbun.info/images/photos/10.jpeg',
              imageBackgroundColor: '#FFFFFF',
              title: 'タイトル2',
              text: '説明2',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'https://shinbunbun.info/',
              },
              actions: [
                {
                  type: 'postback',
                  label: 'ポストバック',
                  data: 'postback-carousel-2',
                },
                {
                  type: 'uri',
                  label: 'URIアクション',
                  uri: 'https://shinbunbun.info/',
                },
              ],
            },
          ],
          imageAspectRatio: 'rectangle',
          imageSize: 'cover',
        },
      };
      break;
    }
    // '画像カルーセルテンプレート'というメッセージが送られてきた時
    case '画像カルーセルテンプレート': {
      // 返信するメッセージを作成
      message = {
        type: 'template',
        altText: '画像カルーセルテンプレート',
        template: {
          type: 'image_carousel',
          columns: [
            {
              imageUrl: 'https://shinbunbun.info/images/photos/4.jpeg',
              action: {
                type: 'postback',
                label: 'ポストバック',
                data: 'image-carousel-1',
              },
            },
            {
              imageUrl: 'https://shinbunbun.info/images/photos/5.jpeg',
              action: {
                type: 'message',
                label: 'メッセージ',
                text: 'いえい',
              },
            },
            {
              imageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
              action: {
                type: 'uri',
                label: 'URIアクション',
                uri: 'https://shinbunbun.info/',
              },
            },
          ],
        },
      };
      break;
    }
    // 'Flex Message'というメッセージが送られてきた時
    case 'Flex Message': {
      // 返信するメッセージを作成
      message = {
        type: 'flex',
        altText: 'Flex Message',
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Flex Message',
                color: '#FFFFFF',
                weight: 'bold',
              },
            ],
          },
          hero: {
            type: 'image',
            url: 'https://pbs.twimg.com/profile_images/1236928986212478976/wDa51i9T_400x400.jpg',
            size: 'xl',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'しんぶんぶん',
                size: 'xl',
                weight: 'bold',
                align: 'center',
              },
              {
                type: 'text',
                text: '会津大学学部一年',
                align: 'center',
              },
              {
                type: 'separator',
                margin: 'md',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: 'ホームページ',
                      uri: 'https://shinbunbun.info/',
                    },
                    style: 'primary',
                    offsetBottom: '10px',
                  },
                  {
                    type: 'button',
                    action: {
                      type: 'uri',
                      label: 'Twitter',
                      uri: 'https://twitter.com/shinbunbun_',
                    },
                    style: 'primary',
                    color: '#1DA1F2',
                  },
                ],
                paddingTop: '10px',
              },
            ],
          },
          styles: {
            header: {
              backgroundColor: '#008282',
            },
          },
        },
      };
      break;
    }
    // 'プロフィール'というメッセージが送られてきた時
    case 'プロフィール': {
      // ユーザーのプロフィール情報を取得
      const profile = await client.getProfile(event.source.userId);
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: `あなたの名前: ${profile.displayName}\nユーザーID: ${profile.userId}\nプロフィール画像のURL: ${profile.pictureUrl}\nステータスメッセージ: ${profile.statusMessage}`,
      };
      break;
    }
    // 'ここはどこ'というメッセージが送られてきた時
    case 'ここはどこ': {
      // 送信元がユーザーとの個チャだった場合
      if (event.source.type === 'user') {
        // 返信するメッセージを作成
        message = {
          type: 'text',
          text: 'ここは個チャだよ！',
        };
        // 送信元がグループだった場合
      } else if (event.source.type === 'group') {
        // 返信するメッセージを作成
        message = {
          type: 'text',
          text: 'ここはグループだよ！',
        };
      }
      break;
    }
    // 上で条件分岐した以外のメッセージが送られてきた時
    default: {
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: `受け取ったメッセージ: ${event.message.text}\nそのメッセージの返信には対応してません...`,
      };
      break;
    }
  }
  return message;
};

// イメージを処理する関数
const imageEvent = () => {
  // 返信するメッセージを作成
  const message = {
    type: 'text',
    text: '画像を受け取りました！',
  };
  // 関数の呼び出し元（index）に返信するメッセージを返す
  return message;
};

// ビデオを処理する関数
const videoEvent = () => {
  // 返信するメッセージを作成
  const message = {
    type: 'text',
    text: 'ビデオを受け取りました！',
  };
  // 関数の呼び出し元（index）に返信するメッセージを返す
  return message;
};

// オーディオを処理する関数
const audioEvent = () => {
  // 返信するメッセージを作成
  const message = {
    type: 'text',
    text: 'オーディオを受け取りました！',
  };
  // 関数の呼び出し元（index）に返信するメッセージを返す
  return message;
};

// ファイルを処理する関数
const fileEvent = () => {
  // 返信するメッセージを作成
  const message = {
    type: 'text',
    text: 'ファイルを受け取りました！',
  };
  // 関数の呼び出し元（index）に返信するメッセージを返す
  return message;
};

// 位置情報を処理する関数
const locationEvent = (event) => {
  // 返信するメッセージを作成
  const message = {
    type: 'text',
    text: `受け取った住所: ${event.message.address}`,
  };
  // 関数の呼び出し元（index）に返信するメッセージを返す
  return message;
};

// スタンプメッセージを処理する関数
const stickerEvent = (event) => {
  let message;
  // スタンプのIDごとに条件分岐
  switch (event.message.stickerId) {
    // スタンプのIDが1988だった場合
    case '1988': {
      // 返信するメッセージを作成
      message = {
        type: 'sticker',
        packageId: '446',
        stickerId: '1989',
      };
      break;
    }
    // それ以外のIDだった場合
    default: {
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: `受け取ったstickerId: ${event.message.stickerId}\nそのスタンプの返信には対応してません...`,
      };
      break;
    }
  }
  // 関数の呼び出し元（index）に返信するメッセージを返す
  return message;
};

// メッセージイベントが飛んできた時に呼び出される
exports.index = (event, client) => {
  let message;
  // メッセージタイプごとの条件分岐
  switch (event.message.type) {
    case 'text': {
      // テキストの場合はtextEventを呼び出す
      // 実行結果をmessageに格納する
      message = textEvent(event, client);
      break;
    }
    case 'image': {
      // イメージの場合はimageEventを呼び出す
      // 実行結果をmessageに格納する
      message = imageEvent();
      break;
    }
    case 'video': {
      // ビデオの場合はvideoEventを呼び出す
      // 実行結果をmessageに格納する
      message = videoEvent();
      break;
    }
    case 'audio': {
      // オーディオの場合はaudioEventを呼び出す
      // 実行結果をmessageに格納する
      message = audioEvent();
      break;
    }
    case 'file': {
      // ファイルの場合はfileEventを呼び出す
      // 実行結果をmessageに格納する
      message = fileEvent();
      break;
    }
    case 'location': {
      // 位置情報の場合はlocationEventを呼び出す
      // 実行結果をmessageに格納する
      message = locationEvent(event);
      break;
    }
    case 'sticker': {
      // スタンプの場合はstickerEventを呼び出す
      // 実行結果をmessageに格納する
      message = stickerEvent(event);
      break;
    }
    // それ以外の場合
    default: {
      // 返信するメッセージを作成
      message = {
        type: 'text',
        text: 'そのイベントには対応していません...',
      };
      break;
    }
  }
  // 関数の呼び出し元（bot.jsのindex）に返信するメッセージを返す
  return message;
};
