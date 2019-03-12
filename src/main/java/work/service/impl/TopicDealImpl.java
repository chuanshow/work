package work.service.impl;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import work.controller.advice.MyAdvice;
import work.service.TopicDealService;

@Service
public class TopicDealImpl implements TopicDealService {
	  
	@Autowired
	  private AmqpTemplate rabbitTemplate;

	
	@Autowired
	private MyAdvice advice;
	@Override
	public void Send(String msg) {
        System.out.println("Sender : " + msg);
        this.rabbitTemplate.convertAndSend(advice.EXCHANGE_NAME(),"", msg);
	}

}
