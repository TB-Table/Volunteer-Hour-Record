<script setup>
import FloatingCards from "@/components/FloatingCards.vue";
import RecordCard from '@/components/Record-card.vue'
import { computed, ref, onMounted, watch } from "vue";

const dialogRef = ref(null)
const formData = ref({
  organization: '',
  activity: '',
  hours: '',
  date: '',
  text: ''
})


const editingRecordId = ref(null);
function editRecord(record) {
  editingRecordId.value = record.id;
  formData.value = {
    organization: record.organization,
    activity: record.activity,
    hours: record.hours,
    date: record.date[0],
    text: record.text
  };
  showDialog();
}

const isSubmitting = ref(false)
async function submitRecord() {
  if (editingRecordId.value !== null) {
    await updateRecord(); 
  } else {
    await PostRecord(); 
  }
}

async function updateRecord() {
  try {
    const response = await fetch(`http://localhost:8989/api/records/${editingRecordId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

    if(!response.ok) {
      throw new Error('Failed to update record');
    }

    hideDialog();
    editingRecordId.value = null;
    await fetchRecords();

  } catch (error) {
    console.error('更新记录失败:', error);
  }
}


function showDialog() {
  dialogRef.value.showModal();
}

function hideDialog() {
  dialogRef.value.close();
}


async function PostRecord(){
   if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const response = await fetch('http://localhost:8989/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

    if(!response.ok) {
      throw new Error('Failed to submit record');
    }

    hideDialog();
    await fetchRecords();
  } catch (error) {
    console.error('提交记录失败:', error);
  } finally {
    isSubmitting.value = false;
  }
} // 自动生成王朝了

const records = ref([]);

async function fetchRecords() {
  try {
    const response = await fetch('http://localhost:8989/api/records');

    if(!response.ok) {
      throw new Error('Failed to fetch records');
    }

    const data = await response.json();
    records.value = data;
  } catch (error) {
    console.error('获取记录失败:', error);
  }
}

onMounted(fetchRecords);


const recentRecords = computed(() => {
  return [...records.value]
    .sort((a, b) => {
      return b.date[0].localeCompare(a.date[0])
    })
    .slice(0, 3)
})

</script>

<template>

<main class="Home-container">
  <section class="First-section">
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
    
  </section>

  <section class="Second-section">
    <div class="recent-header">
        <div>
          <h2>Recent Activity</h2>
        </div>

        <button class="add-button" @click="showDialog">ADD</button>
          <dialog ref="dialogRef">
              <form @submit.prevent="submitRecord">
                <h3>填写志愿记录</h3>
                <label>organization</label>
                <input v-model="formData.organization" required>

                <label>activity</label>
                <input v-model="formData.activity" required>

                <label>hours</label>
                <input v-model="formData.hours" required>

                <label>date</label>
                <input v-model.number="formData.date" 
                type="date"
                min="0" 
                required
                /> <!--转化数字-->

                <label>text</label>
                <input v-model="formData.text">

                <button type="submit">Submit</button> 
                <button type="button" @click="hideDialog">Cancel</button> 
                <!-- 到底要用英文还是中文好。 -->
              </form>
          </dialog>

    </div>

    <div class="activity-list">
        <!-- 活动记录 -->
      <div
          v-for="record in recentRecords" 
          :key="record.id" 
          class="activity-item"> <!-- 加一层list的div -->

        <div class="activity-info"> <!-- 加item的div-->
            <h3>{{ record.organization }}</h3>
            <span class="activity-detail"> <!--加一层垂直排列-->
              {{ record.activity }} · {{ record.date[0] }}
            </span>
        </div>

          <strong>{{ record.hours }} hrs</strong> <!--这段单发-->
      </div>
    </div>
  </section>
</main>
</template>

<style scoped>
.Home-container {
  display: flex;
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: calc(100vh - 106px);
  box-sizing: border-box;
}

.Left-container,
.Right-container {
  min-width: 0;
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

.First-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 32px;

  width: 100%;
  min-height: calc(100vh - 106px);
  padding: 32px;
  box-sizing: border-box;
}


.Second-section {
  width: 100%;
  min-height: 100vh;
  padding: 70px 5% 90px;
  
  box-sizing: border-box;
  background: #f7f8fa;
  font-family: Arial, Helvetica, sans-serif;
}

/* Header */
.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1250px;
  margin: 0 auto 38px;
}

.recent-header h2 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #202124;
}

.recent-header p {
  margin: 10px 0 0;
  color: #8a8f98;
  font-size: 16px;
}

.recent-header > span {
  padding: 13px 24px;
  border-radius: 9px;
  background: #ed8b0c;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.recent-header > span:hover {
  background: #d87900;
  transform: translateY(-2px);
}

/* Activity list */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1250px;
  margin: 0 auto;
}

/* Activity card */
.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100px;
  padding: 24px 30px;
  box-sizing: border-box;

  background: white;
  border: 1px solid #eceef1;
  border-radius: 14px;

  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: #ed8b0c;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* Organization */
.activity-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-info h3 {
  margin: 0;
  color: #252525;
  font-size: 20px;
  font-weight: 650;
}

/* Activity + date */
.activity-detail {
  color: #9298a2;
  font-size: 15px;
}

/* Hours */
.activity-item strong {
  color: #ed8b0c;
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}




/* 添加dialog css */
button {
  cursor: pointer;
  font-family: inherit;
}

.add-button {
  padding: 10px 20px;
  background: #ed8b0c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease;
}

.add-button:hover {
  background: #d97900;
}

/* Dialog */
dialog {
  width: 460px;
  max-width: calc(100% - 32px);
  padding: 32px;
  border: none;
  border-radius: 14px;
  background: #ffffff;
  color: #222;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.18);
  margin: auto;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
}

/* Form */
dialog form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

dialog h2 {
  margin: 0 0 14px;
  font-size: 23px;
  font-weight: 700;
}

dialog label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-top: 4px;
}

dialog input,
dialog textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #dedede;
  border-radius: 7px;
  background: #fafafa;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

dialog input:focus,
dialog textarea:focus {
  border-color: #ed8b0c;
  box-shadow: 0 0 0 3px rgba(237, 139, 12, 0.12);
  background: white;
}

dialog textarea {
  min-height: 90px;
  resize: vertical;
}

/* Form Buttons */
dialog button {
  padding: 11px;
  border: none;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
}

dialog button[type="submit"] {
  margin-top: 12px;
  background: #ed8b0c;
  color: white;
}

dialog button[type="submit"]:hover {
  background: #d97900;
}

dialog button[type="button"] {
  background: #f1f1f1;
  color: #444;
}

dialog button[type="button"]:hover {
  background: #e5e5e5;
}


/* dialog动画 */
dialog[open] {
  animation: popBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

@keyframes popBounce {
  0% {
    opacity: 0;
    transform: scale(0.75);
  }
  70% {
    opacity: 1;
    transform: scale(1.04);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.pop-bounce {
  animation: popBounce 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}


/* Mobile */
@media (max-width: 600px) {
  .Second-section {
    padding: 50px 20px;
  }

  .recent-header h2 {
    font-size: 27px;
  }

  .activity-item {
    min-height: 85px;
    padding: 18px;
  }

  .activity-info h3 {
    font-size: 17px;
  }

  .activity-detail {
    font-size: 13px;
  }
}


</style> 
