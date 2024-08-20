<template>
  <div class="page-index">
    <div class="order">
      <!-- 订单统计 -->
      <a-card
        title="订单统计"
        class="mg-b5"
      >
        <div class="pending">
          <a-row :gutter="40">
            <a-col :span="6">
              <dl>
                <dt style="background: #ff851b">
                  <i class="fa fa-truck fs40"></i>
                </dt>
                <dd>
                  <router-link to="/stores/order">
                    <h3>订单总数</h3>
                    <p>
                      <strong>{{ order.total }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #ff851b">
                  <i class="fa fa-truck fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.WaitDelivery}`">
                    <h3>待发货</h3>
                    <p>
                      <strong>{{ order.waitDelivery }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #ff851b">
                  <i class="fa fa-truck fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.AlreadyDelivery}`">
                    <h3>已发货</h3>
                    <p>
                      <strong>{{ order.alreadyDelivery }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #605ca8">
                  <i class="fa fa-money fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.WaitReceivingGoods}`">
                    <h3>待收货</h3>
                    <p>
                      <strong>{{ order.waitReceivingGoods }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #605ca8">
                  <i class="fa fa-money fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.AlreadyReceivingGoods}`">
                    <h3>已收货</h3>
                    <p>
                      <strong>{{ order.alreadyReceivingGoods }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #605ca8">
                  <i class="fa fa-money fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.WaitPay}`">
                    <h3>待付款</h3>
                    <p>
                      <strong>{{ order.waitPay }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #d81b60">
                  <i class="fa fa-mail-reply-all fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.WaitComment}`">
                    <h3>待评价</h3>
                    <p>
                      <strong>{{ order.waitComment }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #d81b23">
                  <i class="fa fa-mail-reply fs40"></i>
                </dt>
                <dd>
                  <router-link :to="`/stores/order?status=${OrderStatus.Close}`">
                    <h3>订单关闭</h3>
                    <p>
                      <strong>{{ order.close }}</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
          </a-row>
        </div>
      </a-card>

      <!-- 回复统计 -->
      <a-card
        title="申请审核统计"
        class="mg-b5"
      >
        <div class="pending">
          <a-row :gutter="40">
            <a-col :span="6">
              <dl>
                <dt style="background: #39cccc">
                  <i class="fa fa-address-card fs40"></i>
                </dt>
                <dd>
                  <h3>待申请商家</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #3c8dbc">
                  <i class="fa fa-cube fs40"></i>
                </dt>
                <dd>
                  <h3>待审核商品</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #605ca8">
                  <i class="fa fa-money fs40"></i>
                </dt>
                <dd>
                  <h3>待审提现</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #d81b60">
                  <i class="fa fa-cog fs40"></i>
                </dt>
                <dd>
                  <h3>维修申请</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #d81b60">
                  <i class="fa fa-retweet fs40"></i>
                </dt>
                <dd>
                  <h3>换货申请</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #3d9970">
                  <i class="fa fa-group fs40"></i>
                </dt>
                <dd>
                  <h3>团购申请活动</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
          </a-row>
        </div>
      </a-card>
      <!--  -->
      <a-card
        title="回复评论统计"
        class="mg-b5"
      >
        <div class="pending">
          <a-row :gutter="40">
            <a-col :span="6">
              <dl>
                <dt style="background: #dd4b39">
                  <i class="fa fa fa-comments-o fs40"></i>
                </dt>
                <dd>
                  <h3>建议待回复</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #00a65a">
                  <i class="fa fa-twitch fs40"></i>
                </dt>
                <dd>
                  <h3>咨询待回复</h3>
                  <p>
                    <strong>0</strong>
                    <span>个</span>
                  </p>
                </dd>
              </dl>
            </a-col>
            <a-col :span="6">
              <dl>
                <dt style="background: #00c0ef">
                  <i class="fa fa-comments fs40"></i>
                </dt>
                <dd>
                  <router-link to="/product/comment">
                    <h3>评论待回复</h3>
                    <p>
                      <strong>0</strong>
                      <span>个</span>
                    </p>
                  </router-link>
                </dd>
              </dl>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts" setup layout="shopping" title="首页">
import apis from '@/apis'
import { OrderStatus } from '@/core/types'

let state = reactive<any>({
  order: {
    total: 0,
    waitPay: 0,
    waitDelivery: 0,
    alreadyDelivery: 0,
    waitReceivingGoods: 0,
    alreadyReceivingGoods: 0,
    waitComment: 0,
    close: 0,
    refund: 0,
  },
})

let { order } = toRefs(state) as any

onMounted(() => {
  getOrderStatistics()
})

const getOrderStatistics = async () => {
  let { data, code, msg } = await apis.getJSON(apis.orderStatistics)
  if (code === 1 && typeof data === 'object') {
    for (let k in state.order) {
      state.order[k] = data[k] || 0
    }
  } else {
    console.log(msg)
  }
}
</script>
.
<style lang="scss" scoped>
.page-index {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .order {
    margin-bottom: 12px;
  }
}
.pending {
  dl {
    display: flex;
    margin-bottom: 30px;
    border: 1px dashed #ccc;
    border-left: none;
    justify-content: left;
    align-items: center;

    dt {
      width: 80px;
      height: 80px;
      text-align: center;
      color: #fff;
      background: #f00;
      justify-content: center;
      display: flex;
      align-items: center;
      margin-right: 20px;
    }

    dd {
      flex: 1;
      white-space: nowrap;
      padding: 0;
      text-align: left;
      margin: 0;
      p {
        padding: 0;
      }
      h3 {
        font-size: 18px;
        padding: 0;
      }
      strong {
        color: #337ab7;
        font-size: 26px;
        padding: 0 10px;
      }
      span {
        color: #999;
        font-size: 18px;
      }
    }
  }
}
</style>
