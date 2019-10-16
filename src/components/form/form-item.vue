<template>
  <div class="i-form-item">
    <label
      v-if="label"
      @click.stop="toggleFloat"
      :class="['i-form-item__label', {'i-form-item__label-required': isRequired, 'i-form-item__label-float': labelFloat}]"
    >
      {{ label }}
      <span v-if="validateState === 'error' && labelFloat">({{validateMessage}})</span>
    </label>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Emitter from '../mixins/emitter'
import AsyncValidator from 'async-validator'
export default {
  name: 'iFormItem',
  mixins: [Emitter],
  props: {
    label: {
      type: String
    },
    prop: {
      type: String
    }
  },
  data () {
    return {
      isRequired: false, // 是否为必填
      validateState: '', // 校验状态
      validateMessage: '', // 校验不通过时的提示信息
      labelFloat: false // label标签是否上浮
    }
  },
  computed: {
    fieldValue () {
      return this.form.model[this.prop]
    }
  },
  inject: ['form'],
  methods: {
    setRules () {
      let rules = this.getRules()
      if (rules.length) {
        rules.every((rule) => {
          this.isRequired = rule.required
        })
      }
      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    onFieldBlur () {
      this.validate('blur')
    },
    onFieldChange () {
      this.validate('change')
    },
    getRules () {
      let formRules = this.form.rules
      formRules = formRules ? formRules[this.prop] : []
      return [].concat(formRules || [])
    },
    getFilteredRule (trigger) {
      const rules = this.getRules()
      return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
    },
    /**
     * 校验数据
     * @param trigger 校验类型
     * @param callback 回调函数
     */
    validate (trigger, callback = function () {}) {
      let rules = this.getFilteredRule(trigger)
      if (!rules || rules.length === 0) {
        return true
      }
      this.validateState = 'validating'
      let descriptor = {}
      descriptor[this.prop] = rules
      const validator = new AsyncValidator(descriptor)
      let model = {}
      model[this.prop] = this.fieldValue
      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''
        callback(this.validateMessage)
      })
    },
    resetField () {
      this.validateState = ''
      this.validateMessage = ''
      this.form.model[this.prop] = this.initialValue
    },
    toggleFloat () {
      this.labelFloat = true
      // 点击后 把值派发给 input 来控制 聚/失焦
      this.broadcast('iInput', 'on-label-click', this.labelFloat)
    }
  },
  mounted () {
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this)
      this.initialValue = this.fieldValue
      this.setRules()
    }
  },
  created () {
    this.$on('on-form-blur', (val) => {
      // 失去焦点 label 降下来 (input有值就不降)
      if (!val) {
        this.labelFloat = false
      }
    })
    // 获得焦点 label 升起
    this.$on('on-form-focus', (val) => {
      this.labelFloat = true
    })
  },
  beforeDestroy () {
    this.dispatch('iForm', 'on-form-item-remove', this)
  }
}
</script>

<style lang="stylus" scoped>
.i-form-item
  position relative
  margin-bottom 1.8rem
  &__label
    position absolute
    left 10%
    z-index 1
    color rgba(0, 0, 0, .38)
    transform translateY(0)
    transform-origin 0 0
    transition transform .3s cubic-bezier(.4, 0, .2, 1), color .3s cubic-bezier(.4, 0, .2, 1)
    span
      color red
      font-size 0.8rem
  &__label-required:before
    content '*'
    color red
  &__label-float
    transform scale(.85714, .85714) translateY(-1.5rem)
    color #188ae2
</style>
