

插件安装
	
图片上传组件 将组件放在自己的组件库里导入即可

**注意 
1.组件加入后一定要去修改自己的上传路径！ 
2.组件自带的图片路径可能会不对，注意修改！ 
3.自己的上传接口的返回值注意修改 我这边是200！
**
	
#### 导入：  
> import imgUpload from '@/components/my-components/uImgUpload.vue';

-------------------------------------   

#### 属性 attribute

| 属性名            | 类型     | 介绍          | 默认值              |
|----------------|--------|-------------|------------------|
| imgArr         | Array  | 图片展示列表      | \[\]             |
| uploadImgCount | Number | 一次可选多少张图片   | 3                |
| imgCount       | Number | 一共可以上传多少张图片 | 3                |
| imgSize        | Number | 上传图片的大小     | 2 \(M\)          |
| imgType        | Array  | 能上传图片的类型(注：小程序下不兼容)    | \["jepg","png"\] |
| closeTip        | Boolean  | 是否关闭提示    | false |
| closeLoading        | Boolean  | 是否关闭加载动画    | true |

------------------------------------- 

#### 方法 method

>开始上传图片 在父页面中调用该方法
> *注意* 一定要给组件 **ref="imgUpload"**

```
      this.$refs.imgUpload.upload(res=>{
			  if(res.code==0){
			   	//0为正常返回，将回调的线上图片数组 赋值给需要提交的表单里
				//res.urlArray 线上路径图片数组
				//TODO
				
				}else{
				//用户没有上传图片的返回 code码为400
				
				}
	});

```

-------------------------------------

####示范代码

```
<template>
<img-upload :imgArr="imgArray" imgCount="9" ref="imgUpload" ></img-upload>
<button type="default" @click="submit">提交</button>
</template>

<script>
	import imgUpload from '@/components/my-components/imgUpload.vue';
	export default {
		components: {
			imgUpload
		},
		data() {
			return {
				imgArray:[]
			}
		},
		methods: {
		  submit(){
			 //开始上传图片
           this.$refs.imgUpload.upload(res=>{
			   if(res.code==0){
			   		//0为正常返回，将回调的线上图片数组 赋值给需要提交的表单里
					//res.urlArray 线上路径图片数组
					//TODO
				}else{
					//用户没有上传图片的返回 code码为400
				}
		   });
	}
}
</script>

```

 
	



	