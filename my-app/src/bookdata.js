import { Button, Space, Modal, Descriptions, notification, message, Table, Input, Form } from "antd"
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const { Search } = Input;

const Detail = (props)=>{
    let detail = props.data

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return(
        <>
            <Button type="primary" onClick={showModal}>
                详情
            </Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Descriptions title="图书详细信息" bordered>
                    <Descriptions.Item label="图书名称" span={2}>{detail.name}</Descriptions.Item>
                    <Descriptions.Item label="图书作者">{detail.author}</Descriptions.Item>
                    <Descriptions.Item label="出版社" span={2}>{detail.publish}</Descriptions.Item>
                    <Descriptions.Item label="ISBN">{detail.isbn}</Descriptions.Item>
                    <Descriptions.Item label="价格" span={2}>{detail.price}元</Descriptions.Item>
                    <Descriptions.Item label="剩余数量">{detail.number}</Descriptions.Item>
                    <Descriptions.Item label="内容简介" span={3}>{detail.intro}</Descriptions.Item>
                    <Descriptions.Item label="出版日期">{detail.pubdate}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    )
}
const { TextArea } = Input;

// 通用post函数
const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const Borrow = (props)=>{
    const data = props.data

    const [isBorrow,setBorrow] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: '通知信息：',
            description:isBorrow?'借阅成功！':'借阅失败！',
        });
    };
    const openNotificationWithIconTwice = (type) => {
        api[type]({
            message: '通知信息：',
            description: '借阅失败！库存数量不足！',
        });
    };

    // 获取设置时间的函数
    function zeroFill(i) {
        if (i >= 0 && i <= 9) {
            return "0" + i;
        } else {
            return i;
        }
    }
    function getCurrentTime(more) {

        if(!more){
            var date = new Date();//当前时间
            var month = zeroFill(date.getMonth() + 1);//月
            var day = zeroFill(date.getDate());//日
            //当前时间
            var curTime = date.getFullYear() + "-" + month + "-" + day
        }else{
            var date = new Date();//当前时间
            var month = zeroFill(date.getMonth() + 2);//月
            let year = date.getFullYear()
            let day = zeroFill(date.getDate());//日
            if(month>12){
                year = date.getFullYear()+1
                month = zeroFill(1)
            }
            var curTime = year + "-" + month + "-" + day
        }
        return curTime;
    }

    const handleCilck = async()=>{
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            borrowusr: self,
            name: data.name,
            borrownum:1,
            borrowdate:getCurrentTime(false),
            shouldreturndate: getCurrentTime(true)
        }
        // console.log(newValue)
        const zero = data.number
        if(zero==0){
            openNotificationWithIconTwice('error')
            return;
        }

        const res1 = await uniPost('http://127.0.0.1:5000/toborrow', newValue)
        console.log('res1', res1)

        openNotificationWithIcon(isBorrow ? 'success' : 'error')

        setTimeout(() => { window.location.reload() }, 2000)
    }

    return(
        <>
            {contextHolder}
            <Space>
                <Button onClick={handleCilck}>借阅</Button>
            </Space>
        </>
    )
}

const Collect = (props)=>{
    const data = props.data

    const [isCollect,setCollect]=useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const info = async() => {
        
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            username:self,
            isbn:data.isbn,
            isCollect
        }
        
        setCollect(!isCollect)

        const res1 = await uniPost('http://127.0.0.1:5000/tocollect',newValue)
        
        // console.log('res1',res1)
        // 这里状态滞后更新，非取反isCollect为真实状态
        messageApi.info(!isCollect ? '收藏成功！' : '取消成功！') 
        // console.log(data.isbn)
        // console.log(isCollect)
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={info} ghost>
                {isCollect ? '取消收藏' :'收藏'}
            </Button>
        </>
    );
}

const baseUrl = 'http://127.0.0.1:5000/bookdata'

const BookList = ()=>{
    const [bookData,setBookData] = useState([])
    const [savedata,setSaveData] = useState([])

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = async () => {
        
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            form.resetFields()
        }, 2000);
        const formValues = form.getFieldsValue();

        // console.log('form', formValues)

        const res1 = await uniPost('http://127.0.0.1:5000/toaddnewbook', formValues)
        // console.log('res1', res1)
        
    };
    const handleCancel = () => {
        // console.log('Clicked cancel button');
        setOpen(false);
    };

    useEffect(()=>{
        // console.log('effect')
        axios.get(baseUrl).then(response => {
            const data = response.data
            // console.log(data)
            setBookData(data)
            setSaveData(data)
        })
    },[])
    //只在第一次渲染时运行

    const onSearch = (value) => {
        console.log(value);
        if (value) {
            const filterdata = bookData.filter(item => {
                // console.log(item.value)
                return item.name.includes(value)
            })
            // console.log(filterdata)
            setBookData(filterdata)
        } else {
            setBookData(savedata)
        }
    }

    return(
        <>
            <Search placeholder="输入书名" onSearch={onSearch} enterButton style={{width: 200,}} />
            <Button type="primary" className="newbook" onClick={showModal}>新建图书</Button>
            <Modal
                title="新建图书"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="确认" cancelText="取消"
            >
                <Form
                    form={form}
                    name="bookmsg"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                >
                    <Form.Item label="图书名称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="图书作者" name="author">
                        <Input />
                    </Form.Item>
                    <Form.Item label="出版社" name="publish">
                        <Input />
                    </Form.Item>
                    <Form.Item label="ISBN" name="isbn">
                        <Input />
                    </Form.Item>
                    <Form.Item label="价格" name="price">
                        <Input />
                    </Form.Item>
                    <Form.Item label="出版日期" name="pubdate">
                        <Input />
                    </Form.Item>
                    <Form.Item label="库存数量" name="number">
                        <Input />
                    </Form.Item>
                    <Form.Item label="内容简介" name="intro">
                        <TextArea rows={4} maxLength={500}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={bookData} locale={{ emptyText: '暂无数据' }} />
        </>
    );
}



const columns = [
    {
        title:'图书名称',
        dataIndex:'name',
        key:'name',
    },
    {
        title: '图书作者',
        dataIndex: 'author',
        key: 'author',
    },
    {
        title: '出版社',
        dataIndex: 'publish',
        key: 'publish',
    },
    {
        title: 'ISBN',
        dataIndex: 'isbn',
        key: 'isbn',
    },
    {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render:(price)=><p>{price}元</p>
    },
    {
        title: '剩余数量',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '操作',
        key: 'action',
        render:(_,record)=>(
            <Space size="middle">
                <Detail data={record}/>
                <Borrow data={record} />
                <Collect data={record} />
            </Space>
        )
    },
]

const bookdata = [
    {
        key:'1',
        id: '1',
        name: '白夜行',
        author: '[日] 东野圭吾',
        publish: '南海出版公司',
        isbn: '9787544258609',
        price: '39.50',
        number: '10',
        intro: '1973年，大阪的一栋废弃建筑中发现一名遭利器刺死的男子。案件扑朔迷离，悬而未决。此后20年间，案件滋生出的恶逐渐萌芽生长，绽放出恶之花。案件相关者的人生逐渐被越来越重的阴影笼罩……“我的天空里没有太阳，总是黑夜，但并不暗，因为有东西代替了太阳。虽然没有太阳那么明亮，但对我来说已经足够。凭借着这份光，我便能把黑夜当成白天。我从来就没有太阳，所以不怕失去。”“只希望能手牵手在太阳下散步”，这句象征本书故事内核的绝望念想，有如一个美丽的幌子，随着无数凌乱、压抑、悲凉的事件片段如纪录片一样一一还原，最后一丝温情也被完全抛弃，万千读者在一曲救赎罪恶的爱情之中悲切动容。',
        pubdate: '2013-1-1',
    },
    {
        key: '2',
        id: '2',
        name: '海边的卡夫卡',
        author: '[日]村上春树',
        publish: '上海译文出版社',
        isbn: '9787532777617',
        price: '59.00',
        number: '5',
        intro: '本书是村上春树仅次于《挪威的森林》的重要长篇小说，以其独特风格的两条平行线展开。一条平行线是少年“田村卡夫卡”，为了挣脱“你要亲手杀死父亲，与母亲乱伦”的诅咒，离开家乡投入成人世界。此后父亲在家被杀，他却疑心自己是在睡梦中杀父。他在一座旧图书馆遇到一位50岁的优雅女性，梦中却与这位女性的少女形象交合，而这位女性又可能是他的生母。一条平行线是一名失忆老人中田，因为一桩离奇的杀人事件走上逃亡之路，在汽车司机星野的帮助下恢复了遥远的战争记忆。',
        pubdate: '2018-8',
    },
    {
        key: '3',
        id: '3',
        name: '大医·破晓篇',
        author: '马伯庸',
        publish: '上海文艺出版社',
        isbn: '9787532183562',
        price: '108.00',
        number: '7',
        intro: '《大医·破晓篇》是马伯庸2022年全新长篇历史小说。挽亡图存、强国保种，这是医者在清末变局中的一声呐喊。大医若史，以济世之仁心，见证大时代的百年波澜。一个在日俄战争中死里逃生的东北少年、一个在伦敦公使馆里跑腿的广东少年、一个不肯安享富贵的上海少女——这三个出身、性格、 际遇各不相同的年轻人，在一九一〇年这一个关键节点，同时踏入了中国红十字会总医院，开始了他们纠葛一生的医海生涯。作为中国第一代公共慈善医生，三个人身上肩负的责任比普通医生更加沉重。哪里有疫情，就要去哪里治疫；哪里有灾害，就要去哪里救灾；哪里爆发战争，就要去哪里冒着枪林弹雨，救死扶伤。上海鼠疫、皖北水灾、武昌起义……晚清时局的跌宕起伏，无时无刻不牵扯着三人的命运。他们相互扶持，从三个蒙昧天真的少年，逐渐成长为三名出色的医生，在一次次救援中感悟到，何为真正的“大医”。',
        pubdate: '2022-9',
    },
    {
        key: '4',
        id: '4',
        name: '球状闪电',
        author: '刘慈欣',
        publish: '四川科学技术出版社',
        isbn: '9787536484276',
        price: '25.00',
        number: '3',
        intro: '某个离奇的雨夜，一个球状闪电闯进了少年的视野，并在一瞬间将少年的父母化为灰烬。少年毕其一生去解开那个将他变成孤儿的自然之谜。但未曾想，多年后，他的研究被纳入“新概念武器”开发计划，他所追寻的球状闪电变成了下一场战争中决定祖国生存或是灭亡的终武器。及锋而试，大西北戈壁滩上升起冰冷的“蓝太阳”，世界变得陌生而怪异。一个完全未知的未来，在宇宙观测者的注视下，降临在人类面前……',
        pubdate: '2016-9',
    },
    {
        key: '5',
        id: '5',
        name: '海葵',
        author: '贝客邦',
        publish: '重庆出版社',
        isbn: '9787229153809',
        price: '49.00',
        number: '5',
        intro: '三线叙述的悬疑故事，一面是神秘失踪的儿童，一面是藏尸和冒领退休金的房客，还有熟睡中被性侵的女房东，三线并行。冬至清晨，杨远九岁的儿子在楼梯间消失无踪，不知缘由。经过民警多方查探，最终发现其曾在失踪前一刻潜入邻居家中，但不知道在那儿有何事发生。但是，可疑的邻居却有着牢不可破的不在场证明，仿佛遥控一般操纵着一场密室逃脱的魔术。某日傍晚，袁午的父亲不幸于酒后猝亡。为了冒领退休金，在经过激烈的思想斗争后，袁午决定藏匿父亲的尸体。但在此期间却遭遇了幻觉与现实交织的恐惧，而又在无意间触及了另一个谜团。独居的单身年轻女房东，在熟睡中被人性侵，醒来察觉不到任何线索。惊恐之下，赶快房屋出租，暗地里查找事情的真相，却也不敢告诉他人。儿童失踪案、藏尸冒领退休金案，还有女房东被性侵，几个看似毫不相关的案件，却相互交织纠缠在一起，相互激荡。',
        pubdate: '2021-3',
    },
    {
        key: '6',
        id: '6',
        name: '如父如子',
        author: '[日] 是枝裕和',
        publish: '湖南文艺出版社',
        isbn: '9787540484651',
        price: '49.80',
        number: '1',
        intro: '当意识到孩 子也在注视着自 己时，那一瞬间，便懂得了什么是如父如子。至今为止都过着一帆风顺的人生的野野宮良多，是大型建筑公司里的精英社员。他和妻子绿结婚多年，感情十分要好，两人共同养育着聪明乖巧的儿子庆多。本以为平静生活将一直持续的三人没有想到的是，一通来自庆多出生医院的 电话将这个小家庭卷到了风口浪尖。面对命中注定的血缘与日夜相伴的亲情，良多骄傲又脆弱的内心摇摆不定。两个家庭站在了人生的十字路口前。分分秒秒，经年累月积淀下来的父子亲情，早已超越了血缘的羁绊。',
        pubdate: '2018-4',
    },
    {
        key: '7',
        id: '7',
        name: '无人生还',
        author: '[英] 阿加莎·克里斯蒂',
        publish: '新星出版社',
        isbn: '9787513338288',
        price: '42.00',
        number: '3',
        intro: '十个相互陌生、身份各异的人受邀前往德文郡海岸边一座孤岛上的豪宅。客人到齐后，主人却没有出现。当晚，一个神秘的声音发出指控，分别说出每个人心中罪恶的秘密。接着，一位客人离奇死亡。暴风雨让小岛与世隔绝，《十个小士兵》——这首古老的童谣成了死亡咒语。如同歌谣中所预言的，客人一个接一个死去……杀人游戏结束后，竟无一人生还！',
        pubdate: '2020-7',
    },
]

export { columns, bookdata, BookList, Detail } 