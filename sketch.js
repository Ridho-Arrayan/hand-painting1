let handPose;
let video;
let hands = [];
let drawing = false; // Menandakan apakah sedang menggambar
let path = []; // Untuk menyimpan posisi-posisi jari telunjuk

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Gambar jejak warna yang sudah ada (titik-titik atau garis)
  for (let i = 0; i < path.length; i++) {
    fill(255, 0, 0); // Warna merah
    noStroke();
    ellipse(path[i].x, path[i].y, 10, 10); // Gambar titik
  }

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    // Gambar titik hijau untuk setiap keypoint
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0); // Warna hijau
      noStroke();
      ellipse(keypoint.x, keypoint.y, 10, 10); // Gambar titik hijau di setiap keypoint
    }

    // Cek apakah jari telunjuk dan jempol saling menyentuh
    let thumb = hand.keypoints[4]; // jempol
    let index = hand.keypoints[8]; // telunjuk

    // Hitung jarak antara telunjuk dan jempol
    let d = dist(thumb.x, thumb.y, index.x, index.y);

    // Jika jaraknya cukup dekat, aktifkan mode menggambar
    if (d < 30) {
      drawing = true;

      // Simpan posisi telunjuk ke path
      path.push(createVector(index.x, index.y)); // Menyimpan posisi jari telunjuk

      // Gambar garis atau titik mengikuti telunjuk
      fill(255, 0, 0); // Warna merah
      noStroke();
      ellipse(index.x, index.y, 10, 10); // Gambar titik

    } else {
      drawing = false;
    }
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}
