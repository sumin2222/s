const ICONS={
    like:"https://i.ifh.cc/waQOpL.png",
    likeActive:"https://i.ifh.cc/fVpvZK.png",
    comment:"https://i.ifh.cc/JcOTCC.webp",
    share:"https://i.ifh.cc/T949A3.png",
    dm:"https://i.ifh.cc/f4cR3A.webp"
};

const posts=[
   {
        media: [ { type: "video", url: "https://i.imgur.com/joup8il.mp4" } ],
        likes:7481,
        isLiked: false,
        comments:302,
        shares:550,
        dms:462,
        text:"리키는 요리를 잘하는 편인데 리키네 아버지도 그렇대요 집안 내력이라는 건 뭘까 笑 <br> 「저기, 너무 완벽하지는 말지?」 라고 말해 줬더니 엄청나게 기뻐했기 때문에 귀엽다고 생각해 버렸다 ·········",
        tag:"#daily #休日デート #tokyo",
        date:"2026.05.05"
    },
    {
        media: [
            { type: "img", url: "https://i.ifh.cc/NBWGGg.jpg" },
            { type: "img", url: "https://i.ifh.cc/yghadh.jpg" },
        ],
        likes:1247,
        isLiked: false,
        comments:53,
        shares:81,
        dms:14,
        text:"도시락 만들었어<br>나 요리에 재능 있는 걸지도 ㅋ<br>비엔나로 문어 만들기라면 도쿄에서 30 위 안에 들 자신 있어 응 분명히! 야호",
        tag:"#彼ごはん #愛情弁当 #sugarbunnies",
        date:"2026.04.14"
    },
    {
        media: [
            { type: "img", url: "https://i.ifh.cc/1Lmz8H.jpg" },
            { type: "img", url: "https://i.ifh.cc/9XnjTP.jpg" },
            { type: "img", url: "https://i.ifh.cc/zQ4Z2o.jpg" }
        ], 
        likes:1339,
        isLiked: false,
        comments:25,
        shares:19,
        dms:7,
        text:"히로짱이랑 만요클럽! 게임 센터에서 내기했는데 패.배.했.어",
        tag:"#東京豊洲万葉倶楽部 #yokohama #デート",
        date:"2026.03.29"
    }
];

const diaries = [
    {
        date: "2026年7月4日",
        text: "오늘 엄청나게 늦잠 자 버렸어. 프렌치토스트랄까, 사이폰커피랄까 마시러 가고 싶었는데. 내일은 네일아트 받으러 갈 거니까 말이야. 히로짱 보고 싶~ 어~"
    },
    {
        date: "2026年7月3日",
        text: "히가시무라 상이 프리파라 입덕한 이후로 회신이 느려서 짜증 난다. 사실 회신이 느린 건 알 바 없는데 2026년에 프리파라를 처음 접하는 비교양인이 일본에 존재해도 되는 건가. 프리파라라는 거, 일본인이라면 누구나 다 알아야 하는 거잖아. 생긴 것도 프리파라에 환장하게 생겼으면서. 오타쿠 비주얼에 맞게 살라고. 이런 못된 생각을 해서 정말 죄송해요. 이 일기를 본 리키의 반응은 「어떻게 일기 첫 문장이 다른 남자 이야기일 수가 있어」 이려나 ······· ? ;;; ㅋㅋㅋ"
    }
];

if (document.getElementById("postCount")) {
    document.getElementById("postCount").textContent = posts.length;
}

const feed=document.getElementById("feed");
const diary=document.getElementById("diary");
const diaryList=document.getElementById("diaryList");
const highlight1 = document.getElementById("highlight-1");
const backToFeedBtn = document.getElementById("backToFeedBtn");

// 댓글 목록을 화면에 그려주는 함수 (❌ 삭제 버튼 추가 포함)
function renderComments(postIdx, commentsArray) {
    const commentListDiv = document.getElementById(`comment-list-${postIdx}`);
    if (!commentListDiv) return;
    
    commentListDiv.innerHTML = ""; // 초기화 후 재생성
    
    commentsArray.forEach((c, commentIdx) => {
        commentListDiv.innerHTML += `
            <div class="comment-item" style="display: flex; justify-content: space-between; align-items: center; line-height: 1.4;">
                <div>
                    <span class="comment-id" style="font-weight: bold; margin-right: 6px;">${c.id}</span>
                    <span>${escapeHtml(c.text)}</span>
                </div>
                <span onclick="deleteComment(${postIdx}, ${commentIdx})" style="cursor: pointer; color: #ccc; font-size: 10px; margin-left: 10px; padding: 2px 5px;">❌</span>
            </div>
        `;
    });
}

if (feed) {
    posts.forEach((post, postIdx)=>{
        const mediaHtml = post.media.map(item => {
            if (item.type === "video") {
                return `<video class="post-image" src="${item.url}" autoplay loop muted playsinline></video>`;
            } else {
                return `<img class="post-image" src="${item.url}">`;
            }
        }).join('');
        
        const showBtns = post.media.length > 1;

        feed.innerHTML+=`
        <div class="post" data-index="${postIdx}">
            <div class="slider-container">
                ${showBtns ? `<button class="slide-btn prev" onclick="moveSlide(${postIdx}, -1)" disabled>＜</button>` : ''}
                <div class="slider-track" id="track-${postIdx}">
                    ${mediaHtml}
                </div>
                ${showBtns ? `<button class="slide-btn next" onclick="moveSlide(${postIdx}, 1)">＞</button>` : ''}
            </div>
            
            <div class="content">
                <div class="icon-bar">
                    <div class="icon-group" onclick="toggleLike(${postIdx})">
                        <img src="${post.isLiked ? ICONS.likeActive : ICONS.like}" class="icon" id="like-icon-${postIdx}">
                        <span class="number" id="like-count-${postIdx}">${post.likes.toLocaleString()}</span>
                    </div>
                    <div class="icon-group" onclick="addComment(${postIdx})" style="cursor: pointer;">
                        <img src="${ICONS.comment}" class="icon">
                        <span class="number" id="comment-count-${postIdx}">${post.comments}</span>
                    </div>
                    <div class="icon-group">
                        <img src="${ICONS.share}" class="icon">
                        <span class="number">${post.shares}</span>
                    </div>
                    <div class="icon-group">
                        <img src="${ICONS.dm}" class="icon">
                        <span class="number">${post.dms}</span>
                    </div>
                </div>
                <div class="text">
                    <span class="text-id">harusa___</span>${post.text}
                </div>
                <div class="tag">
                    ${post.tag}
                </div>
                <div class="comment-list" id="comment-list-${postIdx}" style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px; font-size: 13px;"></div>
                <div class="date">
                    ${post.date}
                </div>
            </div>
        </div>
        `;
    });
}

if (diaryList) {
    diaries.forEach((item) => {
        diaryList.innerHTML += `
            <div class="diary-card" onclick="toggleDiary(this)">
                <span class="diary-date">${item.date}</span>
                <p class="diary-text">${item.text}</p>
                <button class="diary-more-btn">続きを読む</button>
            </div>
        `;
    });
}

const currentIndices = new Array(posts.length).fill(0);

window.moveSlide = function(postIdx, direction) {
    const track = document.getElementById(`track-${postIdx}`);
    if (!track) return;
    const postElement = track.closest('.post');
    const prevBtn = postElement.querySelector('.slide-btn.prev');
    const nextBtn = postElement.querySelector('.slide-btn.next');
    const maxIndex = posts[postIdx].media.length - 1;
    currentIndices[postIdx] += direction;
    if (currentIndices[postIdx] < 0) currentIndices[postIdx] = 0;
    if (currentIndices[postIdx] > maxIndex) currentIndices[postIdx] = maxIndex;
    const curIndex = currentIndices[postIdx];
    track.style.transform = `translateX(-${curIndex * 100}%)`;
    if(prevBtn) prevBtn.disabled = (curIndex === 0);
    if(nextBtn) nextBtn.disabled = (curIndex === maxIndex);
}

window.toggleDiary = function(cardElement) {
    const btn = cardElement.querySelector(".diary-more-btn");
    const isExpanded = cardElement.classList.toggle("expanded");
    btn.textContent = isExpanded ? "折りたたむ" : "続きを読む";
}

window.toggleLike = function(postIdx) {
    const post = posts[postIdx];
    const likeIcon = document.getElementById(`like-icon-${postIdx}`);
    const likeCount = document.getElementById(`like-count-${postIdx}`);
    post.isLiked = !post.isLiked;
    if (post.isLiked) { post.likes += 1; likeIcon.src = ICONS.likeActive; }
    else { post.likes -= 1; likeIcon.src = ICONS.like; }
    likeCount.textContent = post.likes.toLocaleString();
}

// [클라우드플레어 주소 연동] 데이터베이스에서 전체 댓글 가져와 동기화하기
async function refreshAllComments() {
    try {
        const response = await fetch('/comments');
        if (!response.ok) return;
        const allComments = await response.json();
        
        posts.forEach((post, postIdx) => {
            const currentComments = allComments[postIdx] || [];
            renderComments(postIdx, currentComments);
            
            const commentCountText = document.getElementById(`comment-count-${postIdx}`);
            if (commentCountText) {
                commentCountText.textContent = post.comments + currentComments.length;
            }
        });
    } catch (e) {
        console.error("댓글 로드 실패:", e);
    }
}

window.addEventListener('load', refreshAllComments);

// 댓글 추가 기능
window.addComment = async function(postIdx) {
    const newComment = prompt("코멘트를 입력해주세요:");
    if (!newComment || newComment.trim() === "") return;

    try {
        const response = await fetch('/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postIdx, text: newComment })
        });
        
        if (response.ok) {
            await refreshAllComments();
        } else {
            alert("⚠️コメントの投稿に失敗しました");
        }
    } catch (e) {
        alert("⚠️サーバーへの接続に失敗しました");
    }
}

// 댓글 삭제 기능
window.deleteComment = async function(postIdx, commentIdx) {
    if (!confirm("このコメントを削除してもよろしいですか？")) return;

    try {
        const response = await fetch('/comments', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postIdx, commentIdx })
        });
        
        if (response.ok) {
            await refreshAllComments();
        } else {
            alert("⚠️コメントの削除に失敗しました");
        }
    } catch (e) {
        alert("⚠️通信中にエラーが発生しました");
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

if(highlight1 && feed && diary) {
    highlight1.addEventListener("click", () => { feed.style.display = "none"; diary.style.display = "flex"; });
}
if(backToFeedBtn && feed && diary) {
    backToFeedBtn.addEventListener("click", () => { diary.style.display = "none"; feed.style.display = "block"; });
}