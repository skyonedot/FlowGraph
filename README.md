整体上分为两部分

一部分是用FlowGraph拿指定的Event

> 这一部分其实是走了弯路的, 尤其是query语句那里. getEvent

另一部分是用FlowGraph拿对于指定Account的TokenTransfer. getToken

> 这个才是正解, 很简单, 也不涉及edge, 用postman过一遍之后, 直接套数据即可