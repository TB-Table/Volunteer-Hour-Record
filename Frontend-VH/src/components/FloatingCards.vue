<script>

</script>

<template>
  <div class="Card-container">
    <div class="QAQ"></div>
    <!--  好玩啊 真的很好玩
    <div class="Card-1">
        <img src="/card-1.jpg" alt="Card Image" />
    </div>
    
    <div class="Card-2">
        <img src="/card-2.png" alt="Card Image" />
    </div>
    

    <div class="card-3">
        <img src="/card-3.PNG" alt="Card Image" />
    </div>
-->

    <div class="card-4">
        <img src="/card-4.JPG" alt="Card Image" />
    </div>
  </div>
</template>

<style scoped>
.Card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  min-height: 400px;
}

.Card-1,
.Card-2,
.card-3,
.card-4 {
  flex: 1;
  min-width: 0;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 20px #0001;
}

.Card-1 img,
.Card-2 img,
.card-3 img,
.card-4 img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3; 
  object-fit: cover;
}

.QAQ {
  width: 70px;
  height: 70px;
  background-color: #000;
}

.QAQ {
  display: none;
}
</style>