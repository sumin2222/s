const BIN_ID = '6a4a4b8679fa234c87d997a2';
const MASTER_KEY = '$2a$10$dOSeYjaKE7HIZ1VjXsDPU.HZn.TuWxJQoqNqcTw9Bs33txl/2izLW';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequest(context) {
  const { request } = context;
  const method = request.method;

  try {
    // 1. 기존 데이터베이스 가져오기
    const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': MASTER_KEY }
    });
    const resData = await getRes.json();
    let dbData = resData.record || {};
    
    // 데이터 구조 기본값 방어 코드
    if (!dbData.posts) dbData.posts = [];
    if (!dbData.comments) dbData.comments = {};

    // 2. 데이터 등록 (POST)
    if (method === 'POST') {
      const body = await request.json();
      const { type } = body; // 'post'(피드등록) 또는 'comment'(댓글등록)

      if (type === 'post') {
        // 새 피드 게시글 추가
        const { text, tag, mediaUrl, mediaType } = body;
        dbData.posts.unshift({
          media: [{ type: mediaType || 'img', url: mediaUrl }],
          likes: 0,
          isLiked: false,
          comments: 0,
          shares: 0,
          dms: 0,
          text: text,
          tag: tag || '',
          date: new Date().toLocaleDateString('ko-KR')
        });
      } else if (type === 'comment') {
        // 새 댓글 추가
        const { postIdx, text } = body;
        if (!dbData.comments[postIdx]) dbData.comments[postIdx] = [];
        dbData.comments[postIdx].push({ id: 'visitor', text });
      }

      // 데이터베이스에 최종 저장 (PUT)
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
        body: JSON.stringify(dbData)
      });

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    // 3. 댓글 삭제 (DELETE)
    if (method === 'DELETE') {
      const body = await request.json();
      const { postIdx, commentIdx } = body;

      if (dbData.comments[postIdx] && dbData.comments[postIdx][commentIdx]) {
        dbData.comments[postIdx].splice(commentIdx, 1);

        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
          body: JSON.stringify(dbData)
        });

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
      return new Response(JSON.stringify({ error: "댓글을 찾을 수 없습니다." }), { status: 400, headers: corsHeaders });
    }

    // 4. 데이터 조회 (GET)
    return new Response(JSON.stringify(dbData), { headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}