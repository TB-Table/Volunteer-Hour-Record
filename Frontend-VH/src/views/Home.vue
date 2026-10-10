<script setup>
import FloatingCards from "@/components/FloatingCards.vue";
import RecordCard from '@/components/Record-card.vue'
</script>

<template>

<main class="Home-container">
    <div class="Left-container">

        <span class="top-highlight">PERSONAL PROJECT · VOLUNTEERHUB</span>

        <h1>Every Hour Counts<br>
            <span>Every Effort Matters</span>
        </h1>

        <p class="description"> A personal website to track volunteer service, 
        document meaningful experiences.
        </p>

        <RecordCard />
    </div>

    <div class="Right-container">
        <FloatingCards />
    </div>

</main>
</template>

<style scoped>
.Home-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 32px;

  width: 100%;
  min-height: calc(100vh - 106px);
  padding: 32px;
  box-sizing: border-box;
}

.Left-container,
.Right-container {
  min-width: 0;
}

@media (max-width: 800px) {
  .Home-container {
    grid-template-columns: 1fr;
  }
}


.top-highlight {
    color: #ed8b0c;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2px;
    margin: 20px 0 0 20px;
}


.Left-container h1 {
  font-size: clamp(38px, 3.6vw, 56px);
  line-height: 1.08;
  letter-spacing: -1.5px;
  margin: 20px 0 0 20px;
}

.Left-container h1 span {
  display: block;
  color: #ed8b0c;
}

.description {
  margin: 20px 0 0 20px;
  max-width: 440px;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.8;
}

</style> 
