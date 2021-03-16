<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent>
              <fieldset>
                <fieldset class="form-group">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="Article Title"
                      v-model="title"
                    />
                    <span class="error-messages">{{ errors[0] }}</span>
                  </validation-provider>
                </fieldset>
                <fieldset class="form-group">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="What's this article about?"
                      v-model="description"
                    />
                    <span class="error-messages">{{ errors[0] }}</span>
                  </validation-provider>
                </fieldset>
                <fieldset class="form-group">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <textarea
                      class="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      v-model="body"
                    ></textarea>
                    <span class="error-messages">{{ errors[0] }}</span>
                  </validation-provider>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter tags"
                    v-model="tagInput"
                    @keyup.enter.stop="inputTag"
                  />
                  <div class="tag-list">
                    <span
                      v-for="(item, index) in tagList"
                      :key="index"
                      class="tag-default tag-pill"
                    >
                      <i class="ion-close-round" @click="removeTag(index)"></i>
                      {{item}}
                    </span>
                  </div>
                </fieldset>
                <div
                  class="btn btn-lg pull-xs-right btn-primary"
                  @click="handleSubmit(publish)"
                >Publish Article</div>
              </fieldset>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publish } from '@/api/articles/'
export default {
  name: 'Post',
  data() {
    return {
      loading: false,
      title: '',
      description: '',
      body: '',
      tagList: [],
      tagInput: ''
    }
  },
  middleware: 'authenticated',
  methods: {
    inputTag() {
      this.tagList.push(this.tagInput)
      this.tagInput = ''
    },
    removeTag(index) {
      this.tagList.splice(index, 1)
    },
    async publish() {
      try {
        this.loading = true
        const { title, description, body, tagList } = this
        const { article } = await publish({
          article: {
            title,
            description,
            body,
            tagList
          }
        })
        // 跳转到文章详情页面
        this.$router.push({ name: 'article', params: { id: article.slug } })
        this.loading = false
      } catch (error) {
        alert(error.toString())
        this.loading = false
      }
    }
  }
}
</script>
