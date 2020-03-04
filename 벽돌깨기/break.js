// canvas 앨리먼트 위에 그래픽 랜더링
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false; // 버튼을 누르는 변수 선언
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
        // 벽돌을 그릴 위치 x,y 위치
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) { // 키를 누르면
    if (e.keyCode == 39) { // 오른쪽 방향키
        rightPressed = true;
    }
    else if (e.keyCode == 37) { // 왼쪽 방향키
        leftPressed = true;
    }
}

function keyUpHandler(e) { // 키에서 손을 떼면
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}


function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() { // 벽돌 충돌 감지 함수
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            // 충돌 감지 반복에서 사용할 벽돌 객체를 b에 저장
            if (b.status == 1) { // 충돌이 일어났는지 확인
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) { // 충돌이 발생했다면
                    // 공의 x 좌표 > 벽돌의 x 좌표
                    // 공의 x 좌표 < 벽돌의 x 좌표 + 가로 길이
                    // 공의 y 좌표 > 벽돌의 y 좌표
                    // 공의 y 좌표 < 벽돌의 y 좌표 + 높이
                    dy = -dy;
                    b.status = 0; // 다시 그리지 않게 벽돌의 속성 0으로
                    score++;
                }
            }
        }
    }
}

function drawScore(){
    ctx.font = "20px jua";
    ctx.loc = "center";
    ctx.fillStyle = "#f6ea8c";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawBall() { // 공을 그리는 코드
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    // 원의 반지름 값을 대입함
    ctx.fillStyle = "#f6ea8c";
    ctx.fill();
    ctx.closePath();

}

function drawPaddle() { // 공을 치기 위한 paddle 정의
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#f6ea8c";
    ctx.fill();
    ctx.closePath();
}


function drawBricks() { // 벽돌 생성 함수
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) { // status =1 , 벽돌을 그림
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#52616a"; // 벽돌 색
                ctx.fill();
                ctx.closePath();
            }
        } // status =0 , 이미 공이 치고간 벽돌이므로 화면에 그릴 필요 x
    }
}

function draw() {    // 공을 움직이는 코드
    // 캔버스 내용들을 지워주기 위한 메소드
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 앞의 0,0 - 직사각형의 좌상단 모서리 표시할 x,y좌표
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection(); // 충돌 감지 활성화
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    } // 충돌 감지 - 원의 둘레를 기준으로 계산
    if (y + dy < ballRadius) { // 밑면에 충돌하는 순간
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        // 공과 패들 사이의 충돌 감지
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            // alert("GAME OVER !");
            document.location.reload();
        }
    }

    // 매 갱신마다 공이 새 위치에 그려짐

    if (rightPressed && paddleX < canvas.width - paddleWidth) { // 우측 5px 움직임
        paddleX += 5;
    }
    else if (leftPressed && paddleX > 0) { // 좌측 5px 움직임
        paddleX -= 5;
    }

    x += dx;
    y += dy;

}
setInterval(draw, 10); // 10밀리초마다 실행


