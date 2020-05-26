/**
 * API接口配置文件
 * 此文件只适用于LBPHP后台输出的接口
 * 如果会冲突，请自行扩展
 */
import team from './apis/team'	//协作接口文件
module.exports = {
	...team,
	//公共接口组
	common:{
		getverifycode:"v1/5b5bdc44796e8", // 统一获取验证码
		config:"config/getinfo", // 获取服务端配置
		update:"v1/5d67b2acdd34d", // 检测更新 
        upload:"v1/5d5fa8984f0c2", // 上传图片 
        get_order_detail:"v1/5d88ab98cbb1f", //统一查询订单
        add_order:"v1/5d784b976769e", //统一下单接口
        wechatpay:"v1/5d7868c138418",// 发起微信支付
        alipay:"v1/5d7a088403825",// 发起支付宝支付
        set_client_id:"v1/5d8b062aefc08"//更新用户的client_id
	},
    //运营组
    operation:{
        get_nav:"v1/5c98e475427d2",//获取指定导航位的导航菜单 
        get_ads:"v1/5c94aa1a043e7",//获取指定广告位的广告
        get_art_list:"v1/5d648c8d37977",//获取指定栏目的文章列表
        get_art_detail:"v1/5d64a46459991",//获取文章详情
        get_column:"v1/5d63befcb25d9",//获取指定的文章单页信息
        get_column_article_list:"v1/5d648c8d37977",//获取指定栏目的文章列表
        
        
        feedback:"v1/5cc3f28296cf0",//提交意见反馈
        get_feedback_list:"v1/5cb97ad30ea88",//我的意见反馈列表
        get_feedback_type:"v1/5d63ba953ee01",//意见反馈类型
        
        get_message_type_list:"v1/5d67ac9454d53",//获取消息类型及最新消息
        get_message_list:"v1/5cc56966e9287",//获取指定类型的消息
        get_message_delete:"v1/5cc56bffbfe7a",//删除指定消息
        
        get_customer_info:"v1/5d8b45ab937f1", //获取指定的客服信息
        
        get_coupon_list:"v1/5cb5ad18a18fb",//我的优惠券列表
        get_coupon_detail:"v1/5cb5aec30095a",//优惠券详情
        get_coupon_type_list:"v1/5d81ea9110809",//获取指定获取方式的优惠券
        receive_coupon:"v1/5d8f00ee67072",//获取指定获取方式的优惠券
        user_find_coupon:"v1/5d916c0c775ff",//会员可用优惠券查询
    },
	//用户接口组
	user:{
		user_name_login:"v1/5c78dbfd977cf", // 用户名密码登录
		user_mobile_login:"v1/5c78dca45ebc1", // 手机号登录
        user_wechat_login:"v1/5d7660a421e69", // 第三方登录
        user_forget_password:"v1/5caeeba9866aa",//忘记密码
        user_register:"v1/5cad9f63e4f94",//用户注册
        
        bind_wechat_account:"v1/5d7757d28d076", // 绑定微信账号
		get_user_info:"v1/5c78c4772da97", // 获取用户信息
        edit_user_info:"v1/5cb54af125f1c",//修改个人资料
        edit_bind_mobile:'v1/5d5f4c28b8636',//更换绑定的手机号
        
        user_certification_status:"v1/5d6bb7f4c39ab",//获取认证状态
        user_certification:"v1/5d6baaec27b0d",//提交认证资料
        user_signin:"v1/5caf00505dd00",     //立即签到
        get_user_signin:'v1/5d78c19d31461',//获取会员签到详情
        
        get_follow_attention:'v1/5cb6c07f79fb8',//关注列表和粉丝列表
        set_follow:'v1/5d7e38b5e7e31',//关注列表和粉丝列表
        
		get_address_list:"v1/5cadcdd909c17",	//获取收货地址列表
		add_address:"v1/5cadb304426d8",	//添加收货地址 
		get_edit_address:"v1/5cadc769e4f16",	//获取修改的收货地址
		edit_address:"v1/5cadcf462e1ad",	//修改的收货地址
		change_default_address:"v1/5cadce9008a62",	//修改默认地址
		del_address:"v1/5cadd0d3a0c93",	//删除收货地址
		
		get_collection_list:"v1/5d89f2123b6be",	//我的收藏
		set_collection:"v1/5d89f462c9c21",	//添加/取消收藏
		cancel_collection:"v1/5d8a1c18cf048",	//取消收藏（我的收藏列表）
        
        get_my_invite_user:"v1/5d8cacff766f8",//我邀请的人
        set_user_lastid:"v1/5d9025003e150"//手动绑定推荐人
	},
    
    money:{
        get_my_money:'v1/5cc45274d6be9',//获取金额信息
        get_money_detail:'v1/5cc45422e5c87',//金额流水明细
        get_recharge_rule :'v1/5cd2b4631e656',//获取充值规则
        get_score_list:'v1/5d75bbc77d252',//会员积分明细
        bind_withdraw_account:'v1/5d7b7d4007529',//绑定提现账号
        get_withdraw_account:'v1/5d7b9bd1c7d7c',//获取绑定的提现账号
        withdraw:'v1/5ce25d5e1ffb8',//提现申请
    },
}