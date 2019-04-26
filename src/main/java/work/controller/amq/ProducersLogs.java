/*package work.controller.amq;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import work.service.TopicDealService;

*//**
 * 
 * 消息生产者  订阅者(发布)模式
 * 选用类型：fanout
 * 
 * @author chuan
 *
 *//*
@RestController()
@RequestMapping(value="/producer")
public class ProducersLogs {
	
	@Autowired
	private TopicDealService topic;
	*//**
	 * 发布消息
	 * @throws IOException 
	 * @throws TimeoutException 
	 *//*
	@RequestMapping(value="/send")
	public void  send(String msg) {
		topic.Send("Hello World !");
	}
}
*/