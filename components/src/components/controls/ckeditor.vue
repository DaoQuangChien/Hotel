<template>
  <div class="ckeditor">
    <Ckeditor 
      v-model="content" 
      :config="config"
    >
    </Ckeditor>
  </div>
</template>
<script>
import Ckeditor from 'vue-ckeditor2'
export default {
  components: { Ckeditor },
  data () {
    return {
      content: '<figure class="image image-illustration" style="float:left"><img alt="" height="266" src="http://c.cksource.com/a/1/img/demo/brownie.jpg" width="400" /><figcaption>Bon App&amp;eacute;tit!</figcaption></figure> <h2>CKEditor Brownies</h2> <h3>Ingredients:</h3> <ul> <li>½ cup flour</li> <li>1 cup sugar</li> <li>½ cup butter, melted</li> <li>2 eggs</li> <li>1/3 cup cocoa powder</li> </ul> <p>Preheat the oven to <strong>350°F</strong> and grease the baking pan. Combine the flour, sugar and cocoa powder in a medium bowl. In another small bowl, whisk together the butter and eggs. Stir the two mixtures until just combined. Bake the brownies for 25 to 35 minutes. Remove from the oven and let it cool for 5 minutes. </p>',
      config: {
        toolbar: [
          { name: 'clipboard', items: ['Undo', 'Redo'] },
          { name: 'styles', items: ['Styles', 'Format'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
          { name: 'links', items: ['Link', 'Unlink'] },
          { name: 'insert', items: ['Image', 'EmbedSemantic', 'Table'] },
          { name: 'tools', items: ['Maximize'] },
          { name: 'editing', items: ['Scayt'] }
        ],
        height: 170
      }
    }
  }
}
</script>
