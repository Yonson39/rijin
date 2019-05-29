<template>
  <div class="content-body">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12" :offset="0">
          <el-form-item label="套餐名称：" prop="activityName" id="activityName">
            <el-input v-model="form.activityName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="状态：">
            <el-radio v-model="form.status" label="1">上线</el-radio>
            <el-radio v-model="form.status" label="0">下线</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="2" style="width:120px;">
          <div class="sub-title">梯度设置：</div>
        </el-col>
        <el-col :span="20">

            <el-row :gutter="10" v-for="(item,index) in form.productGroup" :key="index">
              <el-col :span="6">
                <el-form-item label="商品数量:">
                  <el-input v-model="item.num" type="number" size="small" style="width:80px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优惠价格:">
                   <el-input v-model="item.price" type="number" size="small" style="width:80px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <i class="el-icon-remove-outline" @click="deleteLadder(index)"></i>&nbsp;&nbsp;
                <i class="el-icon-circle-plus-outline" @click="addLadder" v-if="index==0"></i>
              </el-col>
            </el-row>
            
        </el-col>
      </el-row>
      <el-form-item size="medium" class="div-submit">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      form: {
        activityName: '',
        status: '1',
        productGroup: [{num:"",price:""}]
      },
      rules: {
        activityName: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    deleteLadder(index)
    {
      if(this.form.productGroup.length>1){
        this.form.productGroup.splice(index,1);
      }
    },
    addLadder()
    {
      this.form.productGroup.push({num:"",price:""});
    },
    submitForm(formName)
    {
      this.$refs[formName].validate((valid,obj) => {
        if (valid) {
          this.submitFormAction();
        } else {
          this.$message.error("验证不通过");
        }
      });
    },
    submitFormAction()
    {
      this.$message.success("提交成功");
    },
    resetForm(formName)
    {
      this.$refs[formName].resetFields();
      this.form.productGroup = [{num:"",price:""}];
    }
  }
}

</script>
