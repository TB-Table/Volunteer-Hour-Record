<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const githubUsername = ref('TB-Table')
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">

      <!-- 左侧 Logo -->
      <a class="brand" href="#home" >
     <span>Volunteer</span>Hub
    </a>

    <div class="nav-right">
      <!-- 右侧导航 -->
      <div class="nav-links">
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/Record">Record</RouterLink>
        <RouterLink to="/Profile">Profile</RouterLink>
      </div>

      <a 
        :href="`https://github.com/${githubUsername}`" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="avatar-link"
        title="前往我的 GitHub"
        >

        <img 
            :src="`https://github.com/${githubUsername}.png`" 
            alt="GitHub Avatar" 
            class="user-avatar"
          />
      </a>
    </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.navbar-inner {
  width: min(1200px, 92%);
  height: 100%;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.brand {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #1f2328;
}

/*logo橙色字体*/
.brand span {
  color: #ed8b0c;
}

/* 导航 */
.nav-links {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 42px;
}


.nav-links a {
  position: relative;

  height: 100%;
  display: flex;
  align-items: center;

  text-decoration: none;
  color: #555;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1px;

  transition: color 0.2s ease;
}

/*鼠标悬停*/
.nav-links a:hover {
  color: #ed8b0c;
}

/* 当前页面 */
.nav-links a.router-link-active {
  color: #1f2328;
}

/* 当前页面底部橙色线 */
.nav-links a.router-link-active::after {
  content: "";

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 3px;
  background: #ed8b0c;
}

/*头像css*/
.nav-right {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 30px; /* 文字和头像之间的间距 */
}

/*悬停样式*/
.avatar-link {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.avatar-link:hover {
  transform: scale(1.08); 
}

.user-avatar {
  width: 65px;      
  height: 65px;       
  border-radius: 50%;  /*圆形*/
  object-fit: cover;   /*防止图片拉伸变形*/
  border: 2px solid #686666; 
  transition: border-color 0.2s ease;
}

/* 鼠标悬停在头像上时，边框颜色变成主题橙色 */
.avatar-link:hover .user-avatar {
  border-color: #ed8b0c; 
}

/* 手机端 */
@media (max-width: 700px) {
  .nav-links {
    gap: 18px;
  }

  .nav-links a {
    font-size: 11px;
  }

  .brand {
    font-size: 18px;
  }
}
</style>

