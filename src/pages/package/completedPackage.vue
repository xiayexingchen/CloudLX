<template>
    <view class="package-detail">
        <!-- 状态区域保持不变 -->
        <view class="status-section">
            <view class="status-icon">
            </view>
            <text class="status-title">包裹已签收</text>
            <text class="status-desc">感谢您对云行者配送服务的信任，期待再次光临</text>
        </view>

        <!-- 包裹信息卡片 -->
        <view class="info-card">
            <view class="card-header">
                <text class="card-title">包裹信息</text>
            </view>

            <view class="info-list">
                <!-- 基础信息（所有包裹都有） -->
                <view class="info-item">
                    <text class="label">包裹编号</text>
                    <text class="value">{{ packageInfo.packageId }}</text>
                </view>
                <view class="info-item">
                    <text class="label">包裹类型</text>
                    <text class="value">{{ packageInfo.packageType }}</text>
                </view>
                <view class="info-item">
                    <text class="label">签收时间</text>
                    <text class="value">{{ packageInfo.packageCompletedTime }}</text>
                </view>
            </view>
        </view>

        <!-- 订单信息卡片（仅机器人配送的包裹显示） -->
        <view class="info-card" v-if="packageInfo.orderId && !packageInfo.isDelete">
            <view class="card-header">
                <text class="card-title">订单信息</text>
            </view>

            <view class="info-list">
                <view class="info-item">
                    <text class="label">订单编号</text>
                    <text class="value">{{ packageInfo.orderId }}</text>
                </view>
                <view class="info-item">
                    <text class="label">下单时间</text>
                    <text class="value">{{ packageInfo.packageOrderCreatedTime }}</text>
                </view>
                <view class="info-item">
                    <text class="label">配送地址</text>
                    <text class="value">{{ packageInfo.packageAddress }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

        <!--    地址信息卡片
    <view class="info-card">
      <view class="card-header">
        <text class="card-title">地址信息</text>
      </view>

      <view class="info-list">
        <view class="info-item">
          <text class="label">取货地址</text>
          <text class="value">{{ packageInfo.pickupAddress }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系人</text>
          <text class="value">{{ packageInfo.contactName }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话</text>
          <text class="value">{{ packageInfo.contactPhone }}</text>
        </view>
      </view>
    </view> -->



                <!--        <view class="info-item">
          <text class="label">支付费用</text>
          <text class="value price">¥{{ packageInfo.payment }}</text>
        </view> -->
        

<script setup>
    import {
        ref,
        computed,
        reactive,
        onMounted,
        getCurrentInstance
    } from 'vue';

    const packageInfo = ref({});

    onMounted(() => {
        const instance = getCurrentInstance().proxy
        const eventChannel = instance.getOpenerEventChannel();
        // 获取上一页面传递的数据
        eventChannel.on('completedData', (data) => {
            packageInfo.value = data;
            console.log('im reciving data from home,', data)
        });
    });
</script>

<style lang="scss" scoped>
    .package-detail {
        min-height: 100vh;
        background-color: #f5f6fa;
        padding: 20px;
    }

    .status-section {
        background: linear-gradient(135deg, #3B82F6, #60A5FA);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        text-align: center;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);

        .status-icon {
            margin-bottom: 12px;
        }

        .status-title {
            font-size: 20px;
            font-weight: 600;
            display: block;
            margin-bottom: 8px;
        }

        .status-desc {
            font-size: 14px;
            opacity: 0.9;
        }
    }

    .info-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        .card-header {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f0f0f0;

            .card-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                position: relative;
                padding-left: 12px;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 16px;
                    background: #3B82F6;
                    border-radius: 2px;
                }
            }
        }

        .info-list {
            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;

                &:not(:last-child) {
                    border-bottom: 1px solid #f5f5f5;
                }

                .label {
                    color: #666;
                    font-size: 14px;
                }

                .value {
                    color: #333;
                    font-size: 14px;
                    font-weight: 500;

                    &.price {
                        color: #f56c6c;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    // 适配暗黑模式
    @media (prefers-color-scheme: dark) {
        .package-detail {
            background-color: #1a1a1a;
        }

        .info-card {
            background: #2c2c2c;

            .card-header {
                border-bottom-color: #3d3d3d;

                .card-title {
                    color: #fff;
                }
            }

            .info-list .info-item {
                border-bottom-color: #3d3d3d;

                .label {
                    color: #999;
                }

                .value {
                    color: #fff;
                }
            }
        }
    }
</style>