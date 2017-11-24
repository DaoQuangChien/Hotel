<template>
  <div class="ckeditor">
    <Ckeditor 
      v-model="ownContent" 
      :config="config"
      :id="id"
    >
    </Ckeditor>
  </div>
</template>
<script>
import Ckeditor from 'vue-ckeditor2'
export default {
  props: ['content', 'id'],
  components: { Ckeditor },
  beforeMount () {
    this.computedContent()
  },
  data () {
    return {
      config: {
        toolbar: [
          { name: 'clipboard', items: ['Undo', 'Redo'] },
          { name: 'styles', items: ['Styles', 'Format'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
          { name: 'insert', items: ['Image', 'EmbedSemantic', 'Table'] }
        ],
        height: 170
      },
      ownContent: ''
    }
  },
  methods: {
    computedContent () {
      this.ownContent = this.content
    }
  }
}
</script>
