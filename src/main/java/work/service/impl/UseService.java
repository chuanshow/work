package work.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import work.entity.po.User;

@Service
public interface UseService {

	
	public List<User> getAllUser();
}
