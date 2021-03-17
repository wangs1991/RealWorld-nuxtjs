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
                      v-model="article.title"
                      :disable="loading"
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
                      v-model="article.description"
                      :disable="loading"
                    />
                    <span class="error-messages">{{ errors[0] }}</span>
                  </validation-provider>
                </fieldset>
                <fieldset class="form-group">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <textarea
                      class="form-control"
                      rows="8"
                      :disable="loading"
                      placeholder="Write your article (in markdown)"
                      v-model="article.body"
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
                    :disable="loading"
                    @keyup.enter.stop="inputTag"
                  />
                  <div class="tag-list">
                    <span
                      v-for="(item, index) in article.tagList"
                      :key="index"
                      class="tag-default tag-pill"
                    >
                      <i class="ion-close-round" @click="removeTag(index)"></i>
                      {{item}}
                    </span>
                  </div>
                </fieldset>
                <button
                  class="btn btn-lg pull-xs-right btn-primary"
                  :disable="loading"
                  @click="handleSubmit(publish)"
                >Publish Article</button>
              </fieldset>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publish, getDetailBySlug, update } from '@/api/articles'
export default {
  name: 'Post',
  async asyncData({ params }) {
    const { id } = params
    let article = {
      title: '',
      description: '',
      body: '',
      tagList: []
    }

    if (id) {
      const response = await getDetailBySlug(id)
      article = response.article
    }
    return {
      article,
      loading: false,
      tagInput: '',
      id
    }
  },
  middleware: 'authenticated',
  methods: {
    inputTag() {
      this.article.tagList.push(this.tagInput)
      this.tagInput = ''
    },
    removeTag(index) {
      this.article.tagList.splice(index, 1)
    },
    async publish() {
      try {
        this.loading = true

        const { article } = this.id
          ? await update(this.id, {
              article: this.article
            })
          : await publish({
              article: this.article
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
