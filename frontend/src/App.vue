<template>
  <div id="app">
    <div class="header">
      <div class="container">
        <h1>Информационная система учета сотрудников факультета</h1>
      </div>
    </div>
    
    <div class="container">
      <nav class="navigation">
        <router-link to="/" class="nav-link">Главная</router-link>
        <router-link to="/departaments" class="nav-link">Факультеты</router-link>
        <router-link to="/employees" class="nav-link">Сотрудники</router-link>
        <router-link to="/positions" class="nav-link">Должности</router-link>
        <router-link to="/contracts" class="nav-link">Договоры</router-link>
        <router-link to="/reports" class="nav-link">Отчеты</router-link>
      </nav>
    </div>

    <router-view class="main-content" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

.navigation {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;

  .nav-link {
    padding: 0.75rem 1.5rem;
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover, &.router-link-active {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }
}

.main-content {
  padding: 2rem 0;
}
</style>

