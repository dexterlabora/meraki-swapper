<template>
  <img
    class="Logo"
    alt="Swapper Logo"
    src="~assets/img/swapper.png"
  >
</template>

<style>
.Logo {
  height: 60px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
