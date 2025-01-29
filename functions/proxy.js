const axios = require("axios");

exports.handler = async function (event) {
  try {
    const url = event.queryStringParameters.url;
    /*if (!url || !url.startsWith("https://namu.wiki/")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "유효한 나무위키 URL이 필요합니다." }),
      };
    }*/

    // 나무위키에서 HTML 데이터 가져오기
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Referer": "https://namu.wiki/",
        "DNT": "1",
        "Connection": "keep-alive",
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS 허용
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: response.data.match(/<title>(.*?)<\/title>/)[1], // 제목 가져오기
        content: response.data, // HTML 전체 데이터 반환
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터를 가져오는 중 오류 발생" }),
    };
  }
};
