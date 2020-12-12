package com.example.chess.db.repo.impl.h2;

import com.example.chess.db.repo.AbstractRepo;
import com.example.chess.model.entity.AbstractEntity;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Transactional(transactionManager = "h2TransactionManager")
public abstract class H2AbstractRepoImpl<T extends AbstractEntity> implements AbstractRepo<T> {

//    TODO remove this and logging statements
    Logger logger = Logger.getLogger(getClass().toString());
    private final Class<T> clazz;

    protected EntityManager entityManager;

    public H2AbstractRepoImpl(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Override
    public void save(T entity) {
        logger.info("Persisting entity: " + entity.toString());
        entityManager.persist(entity);
        logger.info("Attempting to retrieve the entity for verification");
        var result = this.findById(entity.getId());
        if (result == null) {
            throw new RuntimeException("Entity failed to be retrieved after saving");
        } else {
            logger.info("Entity successfully retrieved: " + entity.toString());
        }
    }

    @Override
    public void delete(T entity) {
        if (entityManager.contains(entity)) {
            entityManager.remove(entity);
        } else {
            var newEntity = entityManager.merge(entity);
            entityManager.remove(newEntity);
        }
    }

    @Override
    public T merge(T entity) {
        return entityManager.merge(entity);
    }

    @Override
    public void deleteById(Object id) {
        var entity = entityManager.find(clazz, id);
        entityManager.remove(entity);
    }

    @Override
    public Optional<T> findById(Object id) {
        logger.info("Attempting to find entity with Id: " + id.toString());
        var entity = entityManager.find(clazz, id);
        return Optional.ofNullable(entity);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<T> findAll() {
        return (List<T>) entityManager.createQuery("SELECT e FROM " + clazz.getSimpleName() + " e").getResultList();
    }

    @PersistenceContext(unitName = "H2PersistenceUnit")
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
}