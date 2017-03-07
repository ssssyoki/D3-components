# D3-components
(React)components with D3.js

####1.slider组件<br/>
  antd的slider组件只实现了滑动区域的上色，对于未滑动区域并没有色彩展示。<br/>
  于是决定使用D3.js实现滑块左右两侧均有色彩展示的sliderComponent,同时渐变色彩中心会变化。<br/>
  使用D3.js(v4)的scaleLinear && axis && SVG 实现。
  
####2.样式<br/>
(1)初始化时:<br/>
![](./slider/slider.jpg)
<br/>
(2)右滑动时:<br/>
![](./slider/slider1.jpg)
<br/>
(3)左滑动时:<br/>
![](./slider/slider2.jpg)
