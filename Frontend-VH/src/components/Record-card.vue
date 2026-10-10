<template>
  <div class="card-container">
    
    <div class="record-card">
      <span class="card-title">TOTAL HOURS</span>
      <h2 class="card-number">52423</h2>
    </div>

    <div class="record-card highlight">
      <span class="card-title">ACTIVITIES</span>
      <h2 class="card-number">16</h2>
    </div>

    <div class="record-card">
      <span class="card-title">ORGANIZATIONS</span>
      <h2 class="card-number">16</h2>
    </div>

     <div class="record-card">
      <span class="card-title">THIS MONTH</span>
      <h2 class="card-number">8</h2>
    </div>

  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
  padding: 20px 0;
  width: 100%;
}

/* 核心卡片样式 */
.record-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px; 
  padding: 24px;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 

  
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition:
  transform 0.25s ease,
  box-shadow 0.25s ease,
  border-color 0.25s ease;
}

.record-card::before {
  content: "";
  position: absolute;

  top: 0;
  left: 50%; /* 水平居中 */

  width: 0;
  height: 3px;

  background: #ed8b0c;

  transform: translateX(-50%); /*往左移动自己宽度的一半*/
  transition: width 0.25s ease;
}



/* hover */
.record-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  border-color: #ed8b0c; 
}

/*标题*/
.card-title {
  font-size: 13px;
  font-weight: 800; 
  color: #666666;
  letter-spacing: 1.5px; 
  margin-bottom: 12px;
}

/*卡片数据 后面再接*/
.card-number {
  font-size: 36px;
  font-weight: 800;
  color: #1f2328;
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif; 
}

/*高亮卡片*/
.record-card.highlight .card-number {
  color: #ed8b0c;
}
</style>
