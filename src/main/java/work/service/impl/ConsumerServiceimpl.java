package work.service.impl;

import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import work.service.ConsumersService;

@Component
@RabbitListener(queues = "fanout.A")
public class ConsumerServiceimpl implements ConsumersService{

	@RabbitHandler
	@Override
	public void getMessages(String msg) {
		System.out.println("接受到的消息是"+msg);
	}

}
