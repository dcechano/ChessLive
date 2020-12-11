package com.example.chess.db.repo.impl.h2;

import com.example.chess.db.repo.PlayerRepo;
import com.example.chess.model.entity.Player;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.logging.Logger;

@Repository(value = "H2PlayerRepo")
@Transactional
public class H2PlayerRepo extends H2AbstractRepoImpl<Player> implements PlayerRepo {


    Logger logger = Logger.getLogger(getClass().toString());

    public H2PlayerRepo() {
        super(Player.class);
    }


    @Override
    public Optional<Player> findById(Object id) {
        logger.info("inside the findByID method");
        return super.findById(id);
    }
}
